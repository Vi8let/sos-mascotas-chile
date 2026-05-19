package sos_mascotas.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import sos_mascotas.backend.DTO.LoginRequest;
import sos_mascotas.backend.DTO.RegisterRequest;
import sos_mascotas.backend.config.JwtUtil;
import sos_mascotas.backend.model.Role;
import sos_mascotas.backend.model.User;
import sos_mascotas.backend.repository.UserRepository;

class AuthServiceTest {

    private final UserRepository userRepository = org.mockito.Mockito.mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = org.mockito.Mockito.mock(PasswordEncoder.class);
    private final JwtUtil jwtUtil = org.mockito.Mockito.mock(JwtUtil.class);
    private final AuthenticationManager authenticationManager = org.mockito.Mockito.mock(AuthenticationManager.class);
    private final AuthService authService = new AuthService(
            userRepository,
            passwordEncoder,
            jwtUtil,
            authenticationManager);

    @Test
    void registerCreatesUserWithEncodedPasswordAndUserRole() {
        var request = new RegisterRequest(
                "persona@test.cl",
                "Password123",
                "Persona",
                "+56912345678");

        when(userRepository.existsByEmail("persona@test.cl")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("encoded-password");
        when(jwtUtil.generate(any(User.class))).thenReturn("jwt-token");

        var response = authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        User savedUser = captor.getValue();
        assertThat(savedUser.getEmail()).isEqualTo("persona@test.cl");
        assertThat(savedUser.getPassword()).isEqualTo("encoded-password");
        assertThat(savedUser.getNombre()).isEqualTo("Persona");
        assertThat(savedUser.getTelefono()).isEqualTo("+56912345678");
        assertThat(savedUser.getRole()).isEqualTo(Role.USER);
        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.email()).isEqualTo("persona@test.cl");
        assertThat(response.role()).isEqualTo("USER");
    }

    @Test
    void loginReturnsJwtAfterSuccessfulAuthentication() {
        var request = new LoginRequest("persona@test.cl", "Password123");
        User user = new User();
        user.setEmail("persona@test.cl");
        user.setRole(Role.USER);

        when(userRepository.findByEmail("persona@test.cl")).thenReturn(Optional.of(user));
        when(jwtUtil.generate(user)).thenReturn("jwt-login-token");

        var response = authService.login(request);

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertThat(response.token()).isEqualTo("jwt-login-token");
        assertThat(response.email()).isEqualTo("persona@test.cl");
        assertThat(response.role()).isEqualTo("USER");
    }
}
