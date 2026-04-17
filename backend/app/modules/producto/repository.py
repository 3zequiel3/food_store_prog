from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.ingrediente.link import IngredienteProductoLink
from app.modules.producto.link import ProductoCategoriaLink
from app.modules.producto.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    model = Producto

    def get_link(self, producto_id: int, categoria_id: int) -> ProductoCategoriaLink | None:
        return self.session.exec(
            select(ProductoCategoriaLink).where(
                ProductoCategoriaLink.producto_id == producto_id,
                ProductoCategoriaLink.categoria_id == categoria_id,
            )
        ).first()

    def add_link(self, link: ProductoCategoriaLink):
        self.session.add(link)

    def delete_link(self, link: ProductoCategoriaLink):
        self.session.delete(link)

    def get_ingrediente_link(
        self, producto_id: int, ingrediente_id: int
    ) -> IngredienteProductoLink | None:
        return self.session.exec(
            select(IngredienteProductoLink).where(
                IngredienteProductoLink.producto_id == producto_id,
                IngredienteProductoLink.ingrediente_id == ingrediente_id,
            )
        ).first()

    def add_ingrediente_link(self, link: IngredienteProductoLink):
        self.session.add(link)

    def delete_ingrediente_link(self, link: IngredienteProductoLink):
        self.session.delete(link)
