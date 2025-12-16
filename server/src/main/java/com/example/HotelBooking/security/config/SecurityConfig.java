package com.example.HotelBooking.security.config;

import com.example.HotelBooking.dto.ApiResponse;
import com.example.HotelBooking.exception.GlobalExceptionHandler;
import com.example.HotelBooking.filter.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static com.example.HotelBooking.constant.SecurityConstants.TOKEN_PREFIX;

@Configuration
@Slf4j
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        int strength = 12;
        return new BCryptPasswordEncoder(strength);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:5173")); // 支持 https
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);        // 关键：允许携带 cookie / Authorization
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(ex -> ex
                                .authenticationEntryPoint((req, res, authEx) -> {
                                    String method = req.getMethod();
                                    String uri = req.getRequestURI();
                                    String query = req.getQueryString();
                                    String fullUrl = uri + (query != null ? "?" + query : "");

                                    log.warn("Authentication failed (unauthorized) | method = {} | fullUrl = {} | reason={}",

                                    method, fullUrl,
                                    authEx.getClass().getSimpleName());

                                    String authHeader = req.getHeader("Authorization");

                                    if (authHeader == null || authHeader.isEmpty()) {
                                        log.info("No Authorization header | {} | {}", method, fullUrl);
                                    } else if (!authHeader.startsWith(TOKEN_PREFIX)) {
                                        log.info("Invalid Authorization header format | header={}", authHeader);
                                    }

                                    log.info("authHeader: {}", authHeader);
                                    res.setStatus(HttpStatus.UNAUTHORIZED.value());
                                    res.setContentType("application/json");
                                    res.getWriter().write(
                                            new ObjectMapper().writeValueAsString(
                                                    ApiResponse.error("Authentication Failed")
                                            )
                                    );
                                })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/places").permitAll()
                        .requestMatchers(HttpMethod.GET, "/resources/**").permitAll()
                        .requestMatchers("/api/places/**").authenticated()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}


