import { Module } from "@nestjs/common";
import { Produto } from "./entities/produto.entity";
import { ProdutoService } from "./services/produto.service";
import { ProdutoController } from "./controllers/produto.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriaModule } from "../categoria/categoria.module";

@Module({
    imports: [TypeOrmModule.forFeature([Produto]), CategoriaModule],
    providers: [ProdutoService, CategoriaModule],
    controllers: [ProdutoController],
    exports: [TypeOrmModule]
})

export class ProdutoModule {} 
