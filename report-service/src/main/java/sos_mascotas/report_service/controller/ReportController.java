package sos_mascotas.report_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sos_mascotas.report_service.DTO.CreateReportRequest;
import sos_mascotas.report_service.DTO.ReportResponse;
import sos_mascotas.report_service.model.EstadoReporte;
import sos_mascotas.report_service.model.TipoReporte;
import sos_mascotas.report_service.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<ReportResponse>> list(
            @RequestParam(required = false) TipoReporte tipo,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(reportService.list(tipo, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ReportResponse> create(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CreateReportRequest req) {
        return ResponseEntity.status(201).body(reportService.create(token, req));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<ReportResponse> updateEstado(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestParam EstadoReporte estado) {
        return ResponseEntity.ok(reportService.updateEstado(token, id, estado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        reportService.delete(token, id);
        return ResponseEntity.noContent().build();
    }
}
