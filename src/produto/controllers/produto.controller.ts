import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProdutoService } from "../services/produto.service";
import { Produto } from "../entities/produto.entity";

@Controller("/produtos")
export class ProdutoController {
    constructor(private readonly produtoService: ProdutoService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Produto[]> {
        return this.produtoService.findAll();
    }

    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
        return this.produtoService.findById(id);
    }

    @Get("/nome/:nome")
    @HttpCode(HttpStatus.OK)
    findByName(@Param('nome') nome: string): Promise<Produto[]> {
        return this.produtoService.findByNome(nome);
    }

    @Get("/preco/maior/:valor")
    @HttpCode(HttpStatus.OK)
    findGreaterPrices(@Param('valor') valor: number): Promise<Produto[]> {
        return this.produtoService.findGreaterPrices(valor);
    }

    @Get("/preco/menor/:valor")
    @HttpCode(HttpStatus.OK)
    findLesserPrices(@Param('valor') valor: number): Promise<Produto[]> {
        return this.produtoService.findLesserPrices(valor);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() produto: Produto): Promise<Produto> {
        return this.produtoService.create(produto);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() produto: Produto): Promise<Produto> {
        return this.produtoService.update(produto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.produtoService.delete(id);
    }

}