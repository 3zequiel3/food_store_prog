from sqlmodel import Session


class UnitOfWork:
    def __init__(self, session: Session):
        self.session = session

    def commit(self):
        try:
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise e

    def rollback(self):
        self.session.rollback()

    def refresh(self, instance):
        self.session.refresh(instance)
