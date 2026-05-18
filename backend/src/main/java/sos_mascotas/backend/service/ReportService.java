package sos_mascotas.backend.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sos_mascotas.backend.DTO.CreateReportRequest;
import sos_mascotas.backend.DTO.ReportResponse;
import sos_mascotas.backend.DTO.UserInfoResponse;
import sos_mascotas.backend.config.UserServiceClient;
import sos_mascotas.backend.model.EstadoReporte;
import sos_mascotas.backend.model.Report;
import sos_mascotas.backend.model.TipoReporte;
import sos_mascotas.backend.repository.ReportRepository;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserServiceClient userServiceClient;

    public List<ReportResponse> list(TipoReporte tipo, String q) {
        List<Report> reports;
        if (q != null && !q.isBlank()) {
            reports = reportRepository.search(q);
        } else if (tipo != null) {
            reports = reportRepository.findByTipo(tipo);
        } else {
            reports = reportRepository.findAll();
        }
        return reports.stream().map(this::toResponse).toList();
    }

    public ReportResponse getById(Long id) {
        return toResponse(reportRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reporte no encontrado")));
    }

    public ReportResponse create(String token, CreateReportRequest req) {
        UserInfoResponse autor = userServiceClient.validateToken(token);

        Report report = new Report();
        report.setTitulo(req.titulo());
        report.setTipo(req.tipo());
        report.setDescripcion(req.descripcion());
        report.setUbicacion(req.ubicacion());
        report.setImagenUrl(req.imagenUrl());
        report.setContacto(req.contacto());
        report.setAutorId(autor.id());

        return toResponse(reportRepository.save(report));
    }

    public ReportResponse updateEstado(String token, Long id, EstadoReporte nuevoEstado) {
        UserInfoResponse user = userServiceClient.validateToken(token);
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reporte no encontrado"));

        boolean esAutor = report.getAutorId().equals(user.id());
        boolean esAdmin = user.role().equals("ROLE_ADMIN");
        if (!esAutor && !esAdmin) {
            throw new AccessDeniedException("Sin permiso para modificar este reporte");
        }

        report.setEstado(nuevoEstado);
        return toResponse(reportRepository.save(report));
    }

    public void delete(String token, Long id) {
        UserInfoResponse user = userServiceClient.validateToken(token);
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reporte no encontrado"));

        if (!report.getAutorId().equals(user.id()) && !user.role().equals("ROLE_ADMIN")) {
            throw new AccessDeniedException("Sin permiso para eliminar este reporte");
        }

        reportRepository.delete(report);
    }

    private ReportResponse toResponse(Report r) {
        return new ReportResponse(
                r.getId(),
                r.getTitulo(),
                r.getTipo(),
                r.getEstado(),
                r.getDescripcion(),
                r.getUbicacion(),
                r.getImagenUrl(),
                r.getContacto(),
                "usuario-" + r.getAutorId(),
                r.getCreadoEn());
    }
}
