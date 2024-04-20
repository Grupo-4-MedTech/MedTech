package repositorio;

import modelo.Departamento;
import modelo.Hospital;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.List;

public class DepartamentoRepositorio {

    final JdbcTemplate conn;

    public DepartamentoRepositorio(JdbcTemplate conn)
    {
        this.conn = conn;
    }

    public Departamento buscarDepartamentoPorId(int id){

        HospitalRepositorio hospitalRepositorio = new HospitalRepositorio(conn);
        Departamento departamento = conn.queryForObject("SELECT * FROM departamento WHERE idDepartamento = ?;", new BeanPropertyRowMapper<>(Departamento.class), id);
        departamento.setHospital(hospitalRepositorio.buscarHospitalPorId(departamento.getFkHospital()));

        return departamento;
    }

}
