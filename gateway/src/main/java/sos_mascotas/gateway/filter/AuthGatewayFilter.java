package sos_mascotas.gateway.filter;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;
import sos_mascotas.gateway.util.JwtUtil;

@Component
public class AuthGatewayFilter implements GatewayFilterFactory<Object> {

    private final JwtUtil jwtUtil;

    public AuthGatewayFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/auth/register",
            "/api/auth/login");

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getPath().toString();
            if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
                return chain.filter(exchange);
            }

            String header = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                return reject(exchange, HttpStatus.UNAUTHORIZED);
            }

            try {
                jwtUtil.extractEmail(header.substring(7));
                return chain.filter(exchange);
            } catch (Exception e) {
                return reject(exchange, HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<Void> reject(ServerWebExchange ex, HttpStatus status) {
        ex.getResponse().setStatusCode(status);
        return ex.getResponse().setComplete();
    }
}
