package sos_mascotas.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import sos_mascotas.gateway.filter.AuthGatewayFilter;
import sos_mascotas.gateway.util.JwtUtil;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public AuthGatewayFilter authGatewayFilter(JwtUtil jwtUtil) {
        return new AuthGatewayFilter(jwtUtil);
    }
}
