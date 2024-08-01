import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import * as moment from 'moment';


@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) { }

    async findByUsuario(usuario: string): Promise<Usuario | undefined> {
        return await this.usuarioRepository.findOne({
            where: { usuario: usuario },
            relations: { produto: true }
        })
    }

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            relations: { produto: true }
        });

    }

    async findById(id: number): Promise<Usuario> {
        let usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: { produto: true }
        });

        if (!usuario)
            throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);
        return usuario;
    }

    async create(usuario: Usuario): Promise<Usuario> {
        // console.log(this.maiorDeIdade(usuario.dataDeNascimento));
        
        let buscaUsuario = await this.findByUsuario(usuario.usuario);

        usuario.dataDeNascimento = moment(usuario.dataDeNascimento, 'DD/MM/YYYY', true).toDate(); // 13/08/2000 -> usuario.dataNascimento

        if (!buscaUsuario) {
            usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
            return await this.usuarioRepository.save(usuario);
        }
        throw new HttpException("O Usuario ja existe!", HttpStatus.BAD_REQUEST);
    }

    async update(usuario: Usuario): Promise<Usuario> {
        let updateUsuario: Usuario = await this.findById(usuario.id);
        let buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (!updateUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        if (!this.maiorDeIdade(usuario.dataDeNascimento)) {
            throw new HttpException('Usuário menor de idade, não pode alterar!', HttpStatus.NOT_FOUND);
        }

        if (buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException('Usuário (e-mail) já Cadastrado!', HttpStatus.BAD_REQUEST);

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario);
    }

    maiorDeIdade(dataNascimento: Date): boolean {
        let diferenca: number = moment(Date.now()).diff(dataNascimento, 'years');
        if (diferenca >= 18) 
            return true;
        return false;
    }
}