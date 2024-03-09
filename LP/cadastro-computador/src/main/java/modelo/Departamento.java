package modelo;

import java.util.ArrayList;
import java.util.List;

public class Departamento {

    private int idDepartamento;
    private String nome;
    private int fkFuncResponsavel;
    public Hospital hospital;
    static List<Departamento> listaDepartamento = new ArrayList<>();

    public Departamento(int idDepartamento, String nome, int fkFuncResponsavel, Hospital hospital)
    {
        this.idDepartamento = idDepartamento;
        this.nome = nome;
        this.fkFuncResponsavel = fkFuncResponsavel;
        this.hospital = hospital;
    };

    //GETTERS
    public int getIdDepartamento()
    {
        return this.idDepartamento;
    }

    public String getNome()
    {
        return this.nome;
    }

    public int getFkFuncResponsavel()
    {
        return this.fkFuncResponsavel;
    }

    public static List<Departamento> getListaDepartamento() {
        return listaDepartamento;
    }

    //Setters

    public void setIdDepartamento(int idDepartamento)
    {
        this.idDepartamento = idDepartamento;
    }

    public void setNome(String nome)
    {
        this.nome = nome;
    }

    public void setFkFuncResponsavel(int fkFuncResponsavel)
    {
        this.fkFuncResponsavel = fkFuncResponsavel;
    }

    public void setFkHospital(Hospital hospital)
    {
        this.hospital = hospital;
    }

    public static void atualizarLista(Departamento departamento)
    {
        self:listaDepartamento.add(departamento);
    }

}
