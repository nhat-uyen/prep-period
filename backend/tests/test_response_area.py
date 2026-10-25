from pydantic import TypeAdapter, ValidationError
import pytest

from app.models.lesson import ResponseArea

adapter = TypeAdapter(ResponseArea)

def test_valid_grid():
  area = adapter.validate_python({"type": "grid", "x_min": -5, "x_max": 5, "y_min": -5, "y_max": 5, "step": 1})
  assert area.show_axes is True

def test_grid_reject_zero_step():
  with pytest.raises(ValidationError):
    adapter.validate_python(
      {"type": "grid", "x_min": 0, "x_max": 5, "y_min": 0, "y_max": 5, "step": 0}
    )

def test_number_line_rejects_reversed_bounds():
  with pytest.raises(ValidationError):
    adapter.validate_python({"type": "number_line",
                             "min": 5,
                             "max": 0,
                             "step": 1})

def test_unknown_response_type_rejected():
  with pytest.raises(ValidationError):
    adapter.validate_python({"type": "hexagon"})

def test_multiple_choice_needs_least_two_choices():
  with pytest.raises(ValidationError):
    adapter.validate_python({"type": "multiple_choice",
                             "choices": ["only one"]})