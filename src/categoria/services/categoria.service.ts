import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Categoria } from "../entities/categoria.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>,
        // private categoriaService: CategoriaService
    ) { }

    async findAll(): Promise<Categoria[]> {
        return this.categoriaRepository.find();
    }

    async findById(id: number): Promise<Categoria> {
        let buscaCategoria = await this.categoriaRepository.findOne({
            where: { id }
        })

        if (!buscaCategoria)
            throw new HttpException("Categoria não foi encontrada!", HttpStatus.NOT_FOUND);
        return buscaCategoria;
    }

    async findByTipo(tipo: string): Promise<Categoria[]> {
        return this.categoriaRepository.find({
            where: { tipo: ILike(`%${tipo}%`) }
        })
    }

    async create(categoria: Categoria): Promise<Categoria> {
        return this.categoriaRepository.save(categoria);
    }

    async update(categoria: Categoria): Promise<Categoria> {
        await this.findById(categoria.id);

        if (!categoria.id)
            throw new HttpException("É necessário passar o ID da categoria!", HttpStatus.NOT_FOUND)

        return this.categoriaRepository.save(categoria);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);

        return await this.categoriaRepository.delete(id);
    }
}