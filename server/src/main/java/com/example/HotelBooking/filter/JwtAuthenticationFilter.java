package com.example.HotelBooking.filter;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.example.HotelBooking.entity.User;
import com.example.HotelBooking.security.jwt.JwtService;
import com.example.HotelBooking.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import static com.example.HotelBooking.constant.SecurityConstants.HEADER_STRING;
import static com.example.HotelBooking.constant.SecurityConstants.TOKEN_PREFIX;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    private final UserService userService;

    private final AuthenticationManager authenticationManager;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private final List<String> permitAllPatterns = List.of(
            "/api/auth/**"
    );

    private boolean isPermitAll(String uri) {
        return permitAllPatterns.stream()
                .anyMatch((pattern) -> pathMatcher.match(pattern, uri));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader(HEADER_STRING);
        String requestURI = request.getRequestURI();

        if (isPermitAll(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
            String token = authorizationHeader.substring(TOKEN_PREFIX.length());
            String userId = jwtService.extractUserId(token);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    if (jwtService.validateToken(token)) {
                        User user = userService.findById(UUID.fromString(userId)).get();

                        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                    }

                } catch (RuntimeException e) {
                }

            }
        }


        filterChain.doFilter(request, response);

    }
}
