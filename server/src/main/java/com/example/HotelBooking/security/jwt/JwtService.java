package com.example.HotelBooking.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;


@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 7 days default
    private long expirationMs;

    private Algorithm getAlgorithm() {
        return Algorithm.HMAC256(secret);
    }

    public String generateToken(UUID userId) {
        Date expiresAt = new Date(System.currentTimeMillis() + expirationMs);

        return JWT.create()
                .withSubject(userId.toString())
                .withIssuedAt(new Date())
                .withExpiresAt(expiresAt)
                .sign(getAlgorithm());
    }

    public String extractUserId(String token) {
        DecodedJWT decoded = verifyToken(token);
        return UUID.fromString(decoded.getSubject()).toString();
    }

    public Date extractExpiresAt(String token) {
        DecodedJWT decoded = verifyToken(token);
        return decoded.getExpiresAt();
    }

    public boolean validateToken(String token) {
        try {
            DecodedJWT decodedJWT = verifyToken(token);
            return true;
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    private DecodedJWT verifyToken(String token) {
        JWTVerifier verifier = JWT.require(getAlgorithm()).build();
        return verifier.verify(token);
    }
}
