from app.core.exceptions import DomainError, NombreYaExiste


class CategoriaDomainError(DomainError):
    pass


class CicloEnJerarquia(CategoriaDomainError):
    def __init__(self, categoria_id: int):
        self.categoria_id = categoria_id
        super().__init__(
            f"La categoria {categoria_id} generaria un ciclo en la jerarquia."
        )
