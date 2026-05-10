package sos_mascotas.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sos_mascotas.backend.DTO.AuthResponse;
import sos_mascotas.backend.DTO.LoginRequest;
import sos_mascotas.backend.DTO.RegisterRequest;
import sos_mascotas.backend.DTO.UserInfoResponse;
import sos_mascotas.backend.model.User;
import sos_mascotas.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest req) {
            return ResponseEntity.status(201).body(authService.register(req));
        }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest req) {
            return ResponseEntity.ok(authService.login(req));
        }

    @GetMapping("/validate")
    public ResponseEntity<UserInfoResponse> validate(
        @RequestHeader("Authorization") String token) {
            return ResponseEntity.ok(authService.validateToken(token));
        }
    
    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> me(
        @AuthenticationPrincipal User user) {
            return ResponseEntity.ok(
                new UserInfoResponse(user.getId(), user.getEmail(), user.getNombre(), user.getRole()));
        }

}
