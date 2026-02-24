from pydantic import BaseModel, Field
from pydantic.functional_validators import BeforeValidator
from typing import Optional, List, Literal, Annotated
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]


class CourseInfo(BaseModel):
    course_id: str
    course_name: str
    semester: int
    department: str


class AuthorRef(BaseModel):
    user_id: str
    display_name: str


class Overview(BaseModel):
    overall_difficulty: Literal["easy", "moderate", "hard"] = "moderate"
    nature_type: Literal["theory", "practical", "mixed"] = "mixed"
    time_required: Literal["low", "medium", "high"] = "medium"
    scoring_potential: Literal["low", "medium", "high"] = "medium"
    risk_level: Literal["low", "moderate", "high"] = "moderate"


class Intro(BaseModel):
    about_subject: str = ""
    general_tips: str = ""
    things_to_keep_in_mind: str = ""


class Unit(BaseModel):
    unit_number: int
    title: str = ""
    unit_difficulty: Literal["easy", "moderate", "hard"] = "moderate"
    scoring_value: Literal["low", "medium", "high"] = "medium"
    skip_safe: bool = False
    topics: List[str] = []


class StudyModes(BaseModel):
    one_day: str = ""
    three_day: str = ""
    full_prep: str = ""
    nine_plus_mode: str = ""


# ── Request / Response models ──────────────────────────────────────────────────

class SubjectCreate(BaseModel):
    name: str
    slug: str
    course: CourseInfo
    overview: Overview = Overview()
    intro: Intro = Intro()
    units: List[Unit] = []
    study_modes: StudyModes = StudyModes()
    midsem_strategy: str = ""
    endsem_strategy: str = ""
    syllabus_image_url: str = ""


class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    course: Optional[CourseInfo] = None
    overview: Optional[Overview] = None
    intro: Optional[Intro] = None
    units: Optional[List[Unit]] = None
    study_modes: Optional[StudyModes] = None
    midsem_strategy: Optional[str] = None
    endsem_strategy: Optional[str] = None
    syllabus_image_url: Optional[str] = None


class SubjectOut(BaseModel):
    id: str
    name: str
    slug: str
    course: CourseInfo
    authors: List[AuthorRef] = []
    overview: Overview
    intro: Intro
    units: List[Unit]
    study_modes: StudyModes
    midsem_strategy: str
    endsem_strategy: str
    syllabus_image_url: str
    is_published: bool
    submitted_by: Optional[PyObjectId] = None
    reviewed_by: Optional[PyObjectId] = None
    created_at: datetime
    updated_at: datetime
