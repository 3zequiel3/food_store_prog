from sqlmodel import Session

from app.core.database import engine


class UnitOfWork:
    def __enter__(self):
        self.session = Session(engine, expire_on_commit=False)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is None:
                self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()

    def refresh(self, instance):
        self.session.refresh(instance)
