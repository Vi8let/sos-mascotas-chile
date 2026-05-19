package sos_mascotas.gateway.filter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;

import reactor.core.publisher.Mono;
import sos_mascotas.gateway.util.JwtUtil;

class AuthGatewayFilterTest {

    private final JwtUtil jwtUtil = org.mockito.Mockito.mock(JwtUtil.class);
    private final GatewayFilterChain chain = org.mockito.Mockito.mock(GatewayFilterChain.class);
    private final AuthGatewayFilter filter = new AuthGatewayFilter(jwtUtil);

    @Test
    void rejectsProtectedRouteWithoutBearerToken() {
        var exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/api/reports").build());

        filter.filter(exchange, chain).block();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        verify(chain, never()).filter(exchange);
    }

    @Test
    void allowsPublicAuthRoutesWithoutToken() {
        var exchange = MockServerWebExchange.from(MockServerHttpRequest.post("/api/auth/login").build());
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        filter.filter(exchange, chain).block();

        verify(chain).filter(exchange);
    }

    @Test
    void rejectsPostCreateReportWithoutBearerToken() {
        var exchange = MockServerWebExchange.from(MockServerHttpRequest.post("/api/reports").build());

        filter.filter(exchange, chain).block();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        verify(chain, never()).filter(exchange);
    }

    @Test
    void allowsProtectedRouteWithValidBearerToken() {
        var exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/api/reports")
                .header("Authorization", "Bearer valid-token")
                .build());
        when(jwtUtil.extractEmail("valid-token")).thenReturn("persona@test.cl");
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        filter.filter(exchange, chain).block();

        verify(chain).filter(exchange);
    }
}
