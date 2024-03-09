package repositorio;

import modelo.Departamento;
import modelo.Hospital;

import java.util.ArrayList;
import java.util.List;

public class DepartamentoRepositorio {

    final boolean connection; //Simulando conexão com o BD

    public DepartamentoRepositorio(boolean connection)
    {
        this.connection = connection;
    }

    public List<Departamento> listarDepartamentosPorHospital(Hospital hospital)
    {
        List<Departamento> listaDepGeral = Departamento.getListaDepartamento();
        List<Departamento> listaDepSelecionado = new ArrayList<>();

        for(int i = 0; i < listaDepGeral.size(); i++){

            Departamento departamento = listaDepGeral.get(i);

            if(departamento.hospital.getSenha().equals(hospital.getSenha()) && departamento.hospital.getCnpj().equals(hospital.getCnpj())){ // Verificando se o departamento é do hospital selecionado
                listaDepSelecionado.add(departamento);
            }
        }

        return listaDepSelecionado;
    }

}
