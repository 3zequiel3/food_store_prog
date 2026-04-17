from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
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
