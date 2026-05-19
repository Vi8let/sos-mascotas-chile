package sos_mascotas.report_service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import sos_mascotas.report_service.DTO.CreateReportRequest;
import sos_mascotas.report_service.DTO.UserInfoResponse;
import sos_mascotas.report_service.config.UserServiceClient;
import sos_mascotas.report_service.model.Report;
import sos_mascotas.report_service.model.TipoReporte;
import sos_mascotas.report_service.repository.ReportRepository;

class ReportServiceTest {

    private final ReportRepository reportRepository = org.mockito.Mockito.mock(ReportRepository.class);
    private final UserServiceClient userServiceClient = org.mockito.Mockito.mock(UserServiceClient.class);
    private final ReportService reportService = new ReportService(reportRepository, userServiceClient);

    @Test
    void createAssignsAuthenticatedUserAsAuthor() {
        var request = new CreateReportRequest(
                "Mascota perdida",
                TipoReporte.ANIMAL_PERDIDO,
                "Perro visto cerca de la plaza",
                "Santiago",
                null,
                "+56912345678");

        when(userServiceClient.validateToken("Bearer token"))
                .thenReturn(new UserInfoResponse(7L, "persona@test.cl", "Persona", "ROLE_USER"));
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = reportService.create("Bearer token", request);

        ArgumentCaptor<Report> captor = ArgumentCaptor.forClass(Report.class);
        verify(reportRepository).save(captor.capture());

        assertThat(captor.getValue().getAutorId()).isEqualTo(7L);
        assertThat(response.titulo()).isEqualTo("Mascota perdida");
        assertThat(response.autorNombre()).isEqualTo("usuario-7");
    }

    @Test
    void getByIdThrowsWhenReportDoesNotExist() {
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reportService.getById(99L))
                .isInstanceOf(java.util.NoSuchElementException.class)
                .hasMessageContaining("Reporte no encontrado");
    }
}
