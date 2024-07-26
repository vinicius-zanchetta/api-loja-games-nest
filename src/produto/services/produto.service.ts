import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { DeleteResult, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { CategoriaService } from "../../categoria/services/categoria.service";

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService: CategoriaService
    ) { }

    async findAll(): Promise<Produto[]> {
        return await this.produtoRepository.find({
            relations: {
                categoria: true,
            }
        }
        );
    }

    async findById(id: number): Promise<Produto> {
        let buscaProduto = await this.produtoRepository.findOne({
            where: { id },
            relations: {
                categoria: true,
            },
        })

        if (!buscaProduto)
            throw new HttpException("Produto não foi encontrado!", HttpStatus.NOT_FOUND);
        return buscaProduto;
    }

    async findByNome(nome: string): Promise<Produto[]> {
        return await this.produtoRepository.find({
            where: { nome: ILike(`%${nome}%`) },
            relations: {
                categoria: true,
            }
        })
    }

    async findGreaterPrices(value: number): Promise<Produto[]> {
        return await this.produtoRepository.find({
            where: {
                preco: MoreThanOrEqual(value),
            },
            order: {
                preco: "ASC"
            },
            relations: {
                categoria: true,
            }
        })
    }

    async findLesserPrices(value: number): Promise<Produto[]> {
        return await this.produtoRepository.find({
            where: {
                preco: LessThanOrEqual(value),
            },
            order: {
                preco: "DESC"
            },
            relations: {
                categoria: true,
            }
        })
    }

    async create(produto: Produto): Promise<Produto> {

        if (produto.categoria) {
            await this.categoriaService.findById(produto.categoria.id);

            return await this.produtoRepository.save(produto);
        }

        return await this.produtoRepository.save(produto);
    }

    async update(produto: Produto): Promise<Produto> {
        await this.findById(produto.id);

        if (!produto.id) {
            throw new HttpException("É necessário passar o ID da produto a ser atualizada!", HttpStatus.NOT_FOUND)
        }

        if (produto.categoria) {
            await this.categoriaService.findById(produto.categoria.id)

            return await this.produtoRepository.save(produto);
        }

        return await this.produtoRepository.save(produto);
    }

    async delete(id: number): Promise<DeleteResult> {

        await this.findById(id);

        return await this.produtoRepository.delete(id);
    }


}