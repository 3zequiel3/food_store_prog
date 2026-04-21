from sqlmodel import Session


class UnitOfWork:
    def __init__(self, session: Session):
        self.session = session

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Si hubo excepción, revertimos la transacción automáticamente
        if exc_type:
            self.rollback()
        # La sesión la gestiona FastAPI via get_session(), no la cerramos acá

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()

    def refresh(self, instance):
        self.session.refresh(instance)
