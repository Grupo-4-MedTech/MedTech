package repositorio;

import modelo.Hospital;

import java.util.ArrayList;
import java.util.List;

public class HospitalRepositorio {
    
    final boolean connection;// simulando conexão com BD
    
    public HospitalRepositorio(boolean connection)
    {
        this.connection = connection;
    };

    public List autenticarHospital(String senha, String cnpj)
    {

        List<Hospital> listaHospitais = Hospital.getListaHospital();

        List<Hospital> hospitalEncontrado = new ArrayList<>();

        for(int i = 0; i < listaHospitais.size(); i ++){
            Hospital hospital = listaHospitais.get(i);

            if(
                    hospital.getSenha().equals(senha) &&
                    hospital.getCnpj().equals(cnpj)
            ){
                System.out.printf("""
                        \n
                        Hospital encontrado com sucesso!
                        Você selecionou o hospital "%s".
                        \n
                        """, hospital.getNomeFantasia());
                hospitalEncontrado.add(hospital);

                return hospitalEncontrado;
            }
        } //Fim for

        return hospitalEncontrado;
    }
    
}
