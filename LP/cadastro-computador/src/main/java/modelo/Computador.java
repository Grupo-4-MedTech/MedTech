package modelo;

import java.util.ArrayList;
import java.util.List;

public class Computador {

//   private int idComputador;

    private String nomeComputador;
    private String codPatrimonio;
    private double maxCpu;
    private double maxRam;
    private double maxDisco;
    private String senha;

    public Departamento departamento;

    private static List<Computador> listaComputadores = new ArrayList<>();

    public Computador(String nomeComputador, String codPatrimonio, double maxCpu, double maxRam, double maxDisco, String senha, Departamento departamentoSelecionado)
    {
        this.nomeComputador = nomeComputador;
        this.codPatrimonio  = codPatrimonio;
        this.maxCpu         = maxCpu;
        this.maxRam         = maxRam;
        this.maxDisco       = maxDisco;
        this.senha          = senha;
        this.departamento   = departamentoSelecionado;
    }

    //GETTERS
    public String getSenha() {
        return this.senha;
    }

    public double getMaxCpu() {
        return this.maxCpu;
    }

    public double getMaxRam() {
        return this.maxRam;
    }

    public String getCodPatrimonio() {
        return this.codPatrimonio;
    }

    public double getMaxDisco() {
        return this.maxDisco;
    }

    public String getNomeComputador() {
        return this.nomeComputador;
    }

    public static List<Computador> getListaComputadores() {
        return listaComputadores;
    }

    //SETTERS


    public void setSenha(String senha) {
        this.senha = senha;
    }

    public void setCodPatrimonio(String codPatrimonio) {
        this.codPatrimonio = codPatrimonio;
    }

    public static void setListaComputadores(List<Computador> listaComputadores) {
        Computador.listaComputadores = listaComputadores;
    }

    public void setMaxCpu(double maxCpu) {
        this.maxCpu = maxCpu;
    }

    public void setMaxDisco(double maxDisco) {
        this.maxDisco = maxDisco;
    }

    public void setMaxRam(double maxRam) {
        this.maxRam = maxRam;
    }

    public void setNomeComputador(String nomeComputador) {
        this.nomeComputador = nomeComputador;
    }

    public static void atualizarLista(Computador computador) {
        self:listaComputadores.add(computador);
    }

    @Override
    public String toString() {
        return
                  "=============================================================================" + "\n"
                + "Nome do computador: " + this.getNomeComputador() + "\n"
                + "Código do patrimônio: " + this.getCodPatrimonio() + "\n"
                + "Capacidade máxima da CPU:" + this.getMaxCpu() + "\n"
                + "Capacidade máxima da RAM:" + this.getMaxRam() + "\n"
                + "Capacidade máxima do Disco:" + this.getMaxDisco() + "\n"
                + "=============================================================================" + "\n"
                + "Identificador do departamento: " + this.departamento.getIdDepartamento() + "\n"
                + "Nome do departamento: " + this.departamento.getNome() + "\n"
                + "=============================================================================" + "\n"
                + "Nome fantasia: " + this.departamento.hospital.getNomeFantasia() + "\n"
                + "Razão social: " + this.departamento.hospital.getRazaoSocial() + "\n"
                + "CNPJ:" + this.departamento.hospital.getCnpj();
    }
}
