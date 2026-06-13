package sos_mascotas.backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import sos_mascotas.backend.DTO.AuthResponse;
import sos_mascotas.backend.DTO.LoginRequest;
import sos_mascotas.backend.DTO.RegisterRequest;
import sos_mascotas.backend.DTO.UserInfoResponse;
import sos_mascotas.backend.model.Role;
import sos_mascotas.backend.model.User;
import sos_mascotas.backend.service.AuthService;

class AuthControllerTest {

    private final AuthService authService = org.mockito.Mockito.mock(AuthService.class);
    private final AuthController authController = new AuthController(authService);

    @Test
    void registerReturnsCreatedResponseFromService() {
        var request = new RegisterRequest("persona@test.cl", "Password123", "Persona", "+56912345678");
        var expected = new AuthResponse("jwt-token", "persona@test.cl", "USER");
        when(authService.register(request)).thenReturn(expected);

        var response = authController.register(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(expected);
        verify(authService).register(request);
    }

    @Test
    void loginReturnsOkResponseFromService() {
        var request = new LoginRequest("persona@test.cl", "Password123");
        var expected = new AuthResponse("jwt-token", "persona@test.cl", "USER");
        when(authService.login(request)).thenReturn(expected);

        var response = authController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expected);
        verify(authService).login(request);
    }

    @Test
    void validateReturnsUserInfoFromService() {
        var expected = new UserInfoResponse(10L, "persona@test.cl", "Persona", "USER");
        when(authService.validateToken("Bearer token")).thenReturn(expected);

        var response = authController.validate("Bearer token");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expected);
        verify(authService).validateToken("Bearer token");
    }

    @Test
    void meBuildsResponseFromAuthenticatedPrincipal() {
        var user = new User();
        user.setId(10L);
        user.setEmail("persona@test.cl");
        user.setNombre("Persona");
        user.setRole(Role.USER);

        var response = authController.me(user);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().id()).isEqualTo(10L);
        assertThat(response.getBody().email()).isEqualTo("persona@test.cl");
        assertThat(response.getBody().nombre()).isEqualTo("Persona");
        assertThat(response.getBody().role()).isEqualTo("USER");
    }
}
