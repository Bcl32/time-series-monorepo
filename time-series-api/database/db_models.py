import uuid
import datetime
from sqlalchemy.sql import func
from sqlalchemy import Column, ForeignKey, Table, DateTime, ARRAY, String, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import JSONB

class Base(DeclarativeBase):
    """Base database model."""
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    time_created: Mapped[datetime.datetime]= mapped_column(DateTime(timezone=True), server_default=func.now())
    time_updated: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=datetime.datetime.now, onupdate=func.now())

class Health(Base):
    """Health database model."""
    __tablename__ = "health"
    heartbeat_frequency: Mapped[int]= mapped_column()
    heartbeat_timeout: Mapped[int]= mapped_column()
    last_received: Mapped[datetime.datetime]= mapped_column(DateTime(timezone=True))
    score: Mapped[int]= mapped_column()
    status: Mapped[str] = mapped_column()

    datafeed_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("datafeed.id", ondelete="CASCADE"))
    datafeed: Mapped["Datafeed"] = relationship(back_populates="health", lazy="selectin")

class Anomaly(Base):
    """Anomaly database model."""
    __tablename__ = "anomaly"
    value: Mapped[float]
    time: Mapped[datetime.datetime]= mapped_column(DateTime(timezone=True))
    anomaly_score: Mapped[float]
    threshold: Mapped[float]
    status: Mapped[str]
    severity: Mapped[str]
    tags: Mapped[list] = mapped_column(ARRAY(String))

    detector_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("detector.id", ondelete="CASCADE"))
    detector: Mapped["Detector"] = relationship(back_populates="anomalies", lazy="selectin")
    detector_name: Mapped[str]

    prediction_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("prediction.id", ondelete="CASCADE"))
    prediction: Mapped["Prediction"] = relationship(back_populates="anomalies", lazy="selectin")
    dataset_name: Mapped[str]

class Dataset(Base):
    """Dataset database model."""
    __tablename__ = "dataset"
    folder: Mapped[str]
    filename: Mapped[str]
    path: Mapped[str]
    labeled: Mapped[bool]
    anomaly_count: Mapped[int]
    file_type: Mapped[str]
    tags: Mapped[list] = mapped_column(ARRAY(String))
    start_time: Mapped[datetime.datetime]= mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime.datetime]= mapped_column(DateTime(timezone=True))
    datafeed_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("datafeed.id", ondelete="CASCADE"))
    datafeed: Mapped["Datafeed"] = relationship(back_populates="datasets", lazy="selectin")
    predictions: Mapped[list["Prediction"]] = relationship(back_populates="dataset", lazy="selectin", cascade="all, delete",  passive_deletes=True)

class Prediction(Base):
    """Predictions database model."""
    __tablename__ = "prediction"

    dataset_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("dataset.id", ondelete="CASCADE"))
    dataset: Mapped["Dataset"] = relationship(back_populates="predictions", lazy="selectin")
    dataset_name: Mapped[str]

    url: Mapped[str]
    
    detector_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("detector.id", ondelete="CASCADE"))
    detector: Mapped["Detector"] = relationship(back_populates="predictions", lazy="selectin")
    detector_name: Mapped[str]

    anomalies: Mapped[list["Anomaly"]] = relationship(back_populates="prediction", lazy="selectin", cascade="all, delete",  passive_deletes=True)

class Detector(Base):
    """Detector database model."""
    __tablename__ = "detector"
    name: Mapped[str]
    description: Mapped[str]
    source: Mapped[str]
    documentation: Mapped[str]
    tags: Mapped[list] = mapped_column(ARRAY(String))
    predictions: Mapped[list["Prediction"]] = relationship(back_populates="detector", lazy="selectin", cascade="all, delete",  passive_deletes=True)
    anomalies: Mapped[list["Anomaly"]] = relationship(back_populates="detector", lazy="selectin", cascade="all, delete",  passive_deletes=True)
    
class Datafeed(Base):
    """Datafeed database model."""
    __tablename__ = "datafeed"
    name: Mapped[str]
    folder: Mapped[str]
    filename: Mapped[str]
    feed_type: Mapped[str]
    tags: Mapped[list] = mapped_column(ARRAY(String))
    start_time: Mapped[datetime.datetime]= mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime.datetime]= mapped_column(DateTime(timezone=True))

    datasets: Mapped[list["Dataset"]] = relationship(back_populates="datafeed", lazy="selectin", cascade="all, delete",  passive_deletes=True)
    health: Mapped["Health"] = relationship(back_populates="datafeed",lazy="selectin",cascade="all, delete",  passive_deletes=True)

    collection_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("collection.id", ondelete="CASCADE"))
    collection: Mapped["Collection"] = relationship(back_populates="datafeeds", lazy="selectin")

class Collection(Base):
    """Collection database model."""
    __tablename__ = "collection"
    name: Mapped[str]
    description: Mapped[str]
    tags: Mapped[list] = mapped_column(ARRAY(String))
    datafeeds: Mapped[list["Datafeed"]] = relationship(back_populates="collection", lazy="selectin", cascade="all, delete",  passive_deletes=True)