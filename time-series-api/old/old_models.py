# from sqlalchemy.orm import Mapped, mapped_column, declarative_base
# from pydantic import BaseModel

# Base = declarative_base()

# class Result(BaseModel):
#     detector: str
#     profile: str
#     file_name: str
#     dataset_group: str

#     class Config:
#         orm_mode = True

# class ResultsDB(Base):
#     __tablename__ = "nab_results"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     detector: Mapped[str]
#     profile: Mapped[str]
#     file_name: Mapped[str]
#     dataset_group: Mapped[str]

#     @property
#     def filepath(self):
#         return f'{self.dataset_group}/{self.file_name}'

#     def __repr__(self) -> str:
#         return f"<User(id={self.id}, Detector={self.detector}, Profile={self.profile}, Dataset_Group={self.dataset_group}, File Name={self.file_name})>"