class ProductoDomainError(Exception):
    pass


class CategoriaNoEsSubcategoria(ProductoDomainError):
    def __init__(self, categoria_id: int):
        self.categoria_id = categoria_id
        super().__init__(
            f"La categoria {categoria_id} es una categoria raiz; "
            "los productos solo pueden asociarse a subcategorias."
        )
