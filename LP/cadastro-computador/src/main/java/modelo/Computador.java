package modelo;

import java.util.ArrayList;
import java.util.List;

public class Computador {

    private int idComputador;
    private String nome;
    private String modeloProcessador;
    private String codPatrimonio;
    private int maxRam;
    private int maxDisco;

    private int fkDepartamento;

    private int fkHospital;
    private Departamento departamento;

    public Computador(int idComputador, String modeloProcessador,  String nome, String codPatrimonio, int maxRam, int maxDisco)
    {
        this.idComputador      = idComputador;
        this.modeloProcessador = modeloProcessador;
        this.nome              = nome;
        this.codPatrimonio     = codPatrimonio;
        this.maxRam            = maxRam;
        this.maxDisco          = maxDisco;
    }

    public Computador(){
        this.departamento = new Departamento();
    };

    //GETTERS

    public int getIdComputador() {
        return this.idComputador;
    }
    public int getMaxDisco() {
        return this.maxDisco;
    }

    public Departamento getDepartamento(){
        return this.departamento;
    }

    public String getNome() {
        return nome;
    }

    public int getFkHospital() {
        return fkHospital;
    }

    public int getFkDepartamento() {
        return fkDepartamento;
    }

    //SETTERS

    public void setCodPatrimonio(String codPatrimonio) {
        this.codPatrimonio = codPatrimonio;
    }

    public void setMaxDisco(int maxDisco) {
        this.maxDisco = maxDisco;
    }

    public void setMaxRam(int maxRam) {
        this.maxRam = maxRam;
    }

    public void setModeloProcessador(String modeloProcessador) {
        this.modeloProcessador = modeloProcessador;
    }

    public void setnome(String nome) {
        this.nome = nome;
    }

    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
        departamento.addComputadores(this);
    }
    public void setIdComputador(int idComputador) {
        this.idComputador = idComputador;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setFkDepartamento(int fkDepartamento) {
        this.fkDepartamento = fkDepartamento;
    }

    public void setFkHospital(int fkHospital) {
        this.fkHospital = fkHospital;
    }

    @Override
    public String toString() {
        return
                  "========================================COMPUTADOR========================================" + "\n"
                + "Nome do computador: " + this.nome + "\n"
                + "Código do patrimônio: " + this.codPatrimonio + "\n"
                + "Modelo da CPU: " + this.modeloProcessador + "\n"
                + "Capacidade máxima da RAM: " + this.maxRam + "GB \n"
                + "Capacidade máxima do Disco: " + this.maxDisco + "GB \n"
                + "========================================DEPARTAMENTO========================================" + "\n"
                + "Identificador do departamento: " + this.departamento.getIdDepartamento() + "\n"
                + "Nome do departamento: " + this.departamento.getNome() + "\n"
                + "========================================HOSPITAL========================================" + "\n"
                + "Nome fantasia: " + this.departamento.getHospital().getNomeFantasia() + "\n"
                + "Razão social: " + this.departamento.getHospital().getRazaoSocial() + "\n"
                + "CNPJ:" + this.departamento.getHospital().getCnpj();
    }
}
