class DomainError(Exception):
    pass


class NombreYaExiste(DomainError):
    def __init__(self, entidad: str, nombre: str):
        self.entidad = entidad
        self.nombre = nombre
        super().__init__(
            f"Ya existe un {entidad} con nombre '{nombre}'."
        )
