package Persistencia;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class Conexao {
    private JdbcTemplate conn;

    public Conexao(){
        BasicDataSource ds = new BasicDataSource();

        ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost:3306/medtech");
        ds.setUsername("usuario");
        ds.setPassword("usuario");

        this.conn = new JdbcTemplate(ds);
    }

    public JdbcTemplate getConn() {
        return this.conn;
    }
}