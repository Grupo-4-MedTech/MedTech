package modelo;

import java.util.ArrayList;
import java.util.List;

public class Computador {

//   private int idComputador;

    private String nomeComputador;
    private String codPatrimonio;
    private int nucleosCpu;
    private int maxRam;
    private int maxDisco;
    private String senha;

    public Departamento departamento;

    private static List<Computador> listaComputadores = new ArrayList<>();

    public Computador(String nomeComputador, String codPatrimonio, int nucleosCpu, int maxRam, int maxDisco, String senha, Departamento departamentoSelecionado)
    {
        this.nomeComputador = nomeComputador;
        this.codPatrimonio  = codPatrimonio;
        this.nucleosCpu     = nucleosCpu;
        this.maxRam         = maxRam;
        this.maxDisco       = maxDisco;
        this.senha          = senha;
        this.departamento   = departamentoSelecionado;
    }

    //GETTERS
    public String getSenha() {
        return this.senha;
    }

    public int getNucleosCpu() {
        return this.nucleosCpu;
    }

    public int getMaxRam() {
        return this.maxRam;
    }

    public String getCodPatrimonio() {
        return this.codPatrimonio;
    }

    public int getMaxDisco() {
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

    public void setNucleosCpu(int nucleosCpu) {
        this.nucleosCpu = nucleosCpu;
    }

    public void setMaxDisco(int maxDisco) {
        this.maxDisco = maxDisco;
    }

    public void setMaxRam(int maxRam) {
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
                  "========================================COMPUTADOR========================================" + "\n"
                + "Nome do computador: " + this.getNomeComputador() + "\n"
                + "Código do patrimônio: " + this.getCodPatrimonio() + "\n"
                + "Quantidade de núcleos da CPU: " + this.getNucleosCpu() + "\n"
                + "Capacidade máxima da RAM: " + this.getMaxRam() + "GB \n"
                + "Capacidade máxima do Disco: " + this.getMaxDisco() + "GB \n"
                + "========================================DEPARTAMENTO========================================" + "\n"
                + "Identificador do departamento: " + this.departamento.getIdDepartamento() + "\n"
                + "Nome do departamento: " + this.departamento.getNome() + "\n"
                + "========================================HOSPITAL========================================" + "\n"
                + "Nome fantasia: " + this.departamento.hospital.getNomeFantasia() + "\n"
                + "Razão social: " + this.departamento.hospital.getRazaoSocial() + "\n"
                + "CNPJ:" + this.departamento.hospital.getCnpj();
    }
}
