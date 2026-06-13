package sos_mascotas.backend.exception;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleIllegalArgumentReturnsBadRequestMessage() {
        var response = handler.handleIllegalArgument(new IllegalArgumentException("email ya registrado"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).containsEntry("error", "email ya registrado");
    }

    @Test
    void handleSecurityExceptionReturnsUnauthorizedMessage() {
        var response = handler.handleSecurityException(new SecurityException("Token invalido o expirado"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).containsEntry("error", "Token invalido o expirado");
    }

    @Test
    void handleGeneralExceptionsIncludesCauseWhenPresent() {
        var cause = new RuntimeException("conexion rechazada");
        var response = handler.handleGeneralExceptions(new RuntimeException("fallo servicio", cause));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).containsEntry("error", "Error interno: fallo servicio");
        assertThat(response.getBody()).containsEntry("cause", "conexion rechazada");
    }

    @Test
    void handleGeneralExceptionsUsesNAWhenCauseIsMissing() {
        var response = handler.handleGeneralExceptions(new RuntimeException("fallo servicio"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).containsEntry("cause", "N/A");
    }
}
