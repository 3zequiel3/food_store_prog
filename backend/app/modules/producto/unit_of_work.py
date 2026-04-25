from app.core.unit_of_work import UnitOfWork
from app.modules.categoria.repository import CategoriaRepository
from app.modules.ingrediente.repository import IngredienteRepository
from app.modules.producto.repository import ProductoRepository


class ProductoUnitOfWork(UnitOfWork):
    repository: ProductoRepository
    categoria_repository: CategoriaRepository
    ingrediente_repository: IngredienteRepository

    def __enter__(self):
        super().__enter__()
        self.repository = ProductoRepository(self.session)
        self.categoria_repository = CategoriaRepository(self.session)
        self.ingrediente_repository = IngredienteRepository(self.session)
        return self
