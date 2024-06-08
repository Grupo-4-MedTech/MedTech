package repositorio;

import modelo.Computador;

import java.util.ArrayList;
import java.util.List;

import modelo.Departamento;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class ComputadorRepositorio {

    final JdbcTemplate conn;
    final JdbcTemplate connSQL;

    public ComputadorRepositorio(JdbcTemplate conn, JdbcTemplate connSQL) {
        this.conn = conn;
        this.connSQL = connSQL;
    }

    public List<Computador> autenticarComputador(String senha, String codPatrimonio) {
        DepartamentoRepositorio departamentoRepositorio = new DepartamentoRepositorio(this.conn, this.connSQL);

        String querySelect = """
                SELECT
                c.idComputador,
                c.nome,
                c.modeloProcessador,
                c.codPatrimonio,
                c.gbRam as maxRam,
                c.gbDisco as maxDisco,
                c.fkDepartamento,
                c.fkHospital
                FROM computador c
                WHERE senha = ?
                AND codPatrimonio = ?;
                """;
        List<Computador> computadorEncontrado = new ArrayList<>();
        JdbcTemplate connExec = connSQL;
        try {
            computadorEncontrado = connSQL.query(querySelect, new BeanPropertyRowMapper<>(Computador.class), senha, codPatrimonio);
        } catch (CannotGetJdbcConnectionException e) {
            connExec = conn;
            computadorEncontrado = conn.query(querySelect, new BeanPropertyRowMapper<>(Computador.class), senha, codPatrimonio);
        }

        if (!computadorEncontrado.isEmpty()) {
            computadorEncontrado.get(0).setDepartamento(departamentoRepositorio.buscarDepartamentoPorId(computadorEncontrado.get(0).getFkDepartamento(), connExec));
        }
        return computadorEncontrado;

    }
}