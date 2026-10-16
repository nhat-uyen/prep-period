from typing import Generic, TypeVar
from pydantic import BaseModel
from sqlalchemy.orm import Query

T = TypeVar("T")

class Page(BaseModel, Generic[T]):
    items: list[T]
    limit: int
    offset: int
    has_more: bool

def paginate_query(query: Query[T], *, limit: int, offset: int,) -> tuple[list[T], bool]:
    """
    Paginate a SQLAlchemy query.

    Args:
        query: The SQLAlchemy query to paginate.
        limit: The maximum number of items to return.
        offset: The number of items to skip before starting to collect the result set.

    Returns:
        A tuple containing the list of items and a boolean indicating if there are more items.
    """
    rows = query.limit(limit + 1).offset(offset).all()
    has_more = len(rows) > limit
    return rows[:limit], has_more
