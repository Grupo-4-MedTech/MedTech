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
        List<Departamento> departamento = conn.query("SELECT * FROM departamento WHERE idDepartamento = ?;", new BeanPropertyRowMapper<>(Departamento.class), id);
        departamento.get(0).setHospital(hospitalRepositorio.buscarHospitalPorId(departamento.get(0).getFkHospital()));

        return departamento.get(0);
    }

}
