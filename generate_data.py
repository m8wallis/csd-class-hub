#!/usr/bin/env python3
"""Turn the classroom survey CSV into public-facing data.js."""

import csv
import json
import re
from collections import Counter
from pathlib import Path

CSV_PATH = Path("/Users/marcwallis/Downloads/Classroom Survey: CSD.csv")
OUT_PATH = Path(__file__).parent / "data.js"

EMPTYISH = {
    "",
    "none",
    "n/a",
    "na",
    "idk",
    "i dont have one",
    "i don't have one",
    "dont have one",
    "don't have one",
    "i don't have one",
    "nothing",
    "nothing else",
    "nothing really",
    "idk ",
}

BAD_BOOKS = {"0", "1", "5", "6", "05"}

GAME_ALIASES = [
    (r"block\s*blast", "Block Blast"),
    (r"\broblox\b", "Roblox"),
    (r"fort\s*nite|fortnight", "Fortnite"),
    (r"minecraft", "Minecraft"),
    (r"rocket league", "Rocket League"),
    (r"animal crossing", "Animal Crossing"),
    (r"deltarune", "Deltarune"),
    (r"pokemon go", "Pokemon Go"),
    (r"\bpokemon\b", "Pokemon"),
    (r"call of duty|\bcod\b", "Call of Duty"),
    (r"marvel rivals", "Marvel Rivals"),
    (r"mario kart", "Mario Kart"),
    (r"don't starve|dont starve", "Don't Starve"),
    (r"undertale", "Undertale"),
    (r"overcooked", "Overcooked"),
    (r"solitaire", "Solitaire"),
    (r"uncharted", "Uncharted"),
    (r"grounded", "Grounded"),
    (r"twdg|walking dead game", "The Walking Dead"),
    (r"mlb the show", "MLB The Show"),
    (r"backyard baseball", "Backyard Baseball"),
    (r"volleyball", "Volleyball"),
]

MUSIC_ALIASES = [
    (r"olivia rodrigo", "Olivia Rodrigo"),
    (r"frank ocean", "Frank Ocean"),
    (r"\bsza\b", "SZA"),
    (r"\bdrake\b|drizzy", "Drake"),
    (r"bruno mars", "Bruno Mars"),
    (r"kendrick", "Kendrick Lamar"),
    (r"michael jackson|micheal jackson", "Michael Jackson"),
    (r"the weeknd", "The Weeknd"),
    (r"laufey", "Laufey"),
    (r"daniel caesar", "Daniel Caesar"),
    (r"pierce the veil", "Pierce The Veil"),
    (r"deftones", "Deftones"),
    (r"lana del rey", "Lana Del Rey"),
    (r"stray kids", "Stray Kids"),
    (r"bad bunny", "Bad Bunny"),
    (r"paramore", "Paramore"),
    (r"the smiths", "The Smiths"),
    (r"blackpink", "BLACKPINK"),
    (r"twenty\s*one\s*pilots", "Twenty One Pilots"),
    (r"cold\s*play", "Coldplay"),
    (r"wave to earth", "wave to earth"),
    (r"mac demarco", "Mac DeMarco"),
]

SNACK_ALIASES = [
    (r"chips|cheetos|doritos|lays|takis|goldfish", "chips"),
    (r"candy|gumm|nerds|reeses|m&ms|smarties|sour patch", "candy"),
    (r"cookie|oreos|nutter", "cookies"),
    (r"chocolate", "chocolate"),
    (r"caprisun|gatorade|boba|orange juice|mountain dew|moutain dew", "drinks"),
]

HOBBY_KEYS = [
    ("soccer", r"soccer"),
    ("basketball", r"basketball"),
    ("football", r"football|flag football"),
    ("volleyball", r"voleyball|volleyball"),
    ("guitar", r"guitar"),
    ("draw", r"draw|doodl|paint"),
    ("dance", r"dance"),
    ("sing", r"sing"),
    ("read", r"\bread"),
    ("bake", r"bak(e|ing)|cook"),
    ("sports", r"sports|track|baseball"),
]


def clean(text: str) -> str:
    if text is None:
        return ""
    text = text.replace("\n", " ").replace("\r", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def is_empty(text: str) -> bool:
    t = clean(text).lower().rstrip(".")
    return t in EMPTYISH or t in BAD_BOOKS


def titleish(text: str) -> str:
    text = clean(text)
    if not text:
        return ""
    # Keep student voice, just tidy obvious all-lowercase short answers
    if text[:1].islower():
        return text[:1].upper() + text[1:]
    return text


def display_name(first: str, last: str) -> str:
    first = clean(first).title()
    last = clean(last)
    initial = last[0].upper() if last else "?"
    return f"{first} {initial}."


def initials(first: str, last: str) -> str:
    first = clean(first)
    last = clean(last)
    return f"{first[:1].upper()}{last[:1].upper()}"


def coding_bucket(raw: str) -> str:
    t = clean(raw).lower()
    if "lot" in t:
        return "Lots of coding"
    if "scratch" in t:
        return "Scratch"
    if "none" in t:
        return "First-time coder"
    return "A little coding"


def screen_bucket(raw: str) -> str:
    t = clean(raw).lower()
    if "less than 3" in t:
        return "Under 3 hrs"
    if "4-6" in t or "4–6" in t:
        return "4–6 hrs"
    if "6-9" in t or "6–9" in t:
        return "6–9 hrs"
    if "over 10" in t:
        return "10+ hrs"
    return titleish(raw)


def extract_named(text: str, aliases) -> list[str]:
    found = []
    lower = text.lower()
    for pattern, label in aliases:
        if re.search(pattern, lower):
            found.append(label)
    return found


def hobby_tags(text: str) -> list[str]:
    tags = []
    lower = text.lower()
    for label, pattern in HOBBY_KEYS:
        if re.search(pattern, lower):
            tags.append(label)
    return tags


def make_tags(row: dict) -> list[str]:
    tags = []
    coding = coding_bucket(row["coding"])
    if coding == "First-time coder":
        tags.append("first-time")
    elif coding == "Lots of coding":
        tags.append("lots-of-coding")
    elif coding == "Scratch":
        tags.append("scratch")
    else:
        tags.append("a-little-coding")

    reads = clean(row["reads"]).lower()
    if reads == "yes":
        tags.append("readers")
    elif reads == "sometimes":
        tags.append("sometimes-reads")

    games = " ".join(extract_named(row["games"] + " " + row["apps"], GAME_ALIASES))
    hobbies = " ".join(hobby_tags(row["hobbies"] + " " + row["games"]))
    blob = f"{games} {hobbies} {row['games']} {row['hobbies']} {row['music']}".lower()

    if "roblox" in blob:
        tags.append("roblox")
    if "fortnite" in blob:
        tags.append("fortnite")
    if "minecraft" in blob:
        tags.append("minecraft")
    if "soccer" in blob:
        tags.append("soccer")
    if "guitar" in blob or "flute" in blob or "piano" in blob or "drums" in blob:
        tags.append("music-makers")
    if "draw" in blob or "paint" in blob or "doodl" in blob:
        tags.append("artists")
    if "basketball" in blob:
        tags.append("basketball")
    return tags


def tokens_for(row: dict) -> dict:
    games = extract_named(row["games"], GAME_ALIASES)
    if not games and not is_empty(row["games"]):
        # keep a cleaned original as a single token
        games = [titleish(row["games"])]
    music = extract_named(row["music"], MUSIC_ALIASES)
    hobbies = hobby_tags(row["hobbies"] + " " + row["games"])
    snacks = extract_named(row["snacks"], SNACK_ALIASES)
    return {
        "games": games,
        "music": music,
        "hobbies": hobbies,
        "snacks": snacks,
    }


def wishlist_items(values, kind: str) -> list[dict]:
    # Hand-grouped popular asks so the board feels designed, not raw.
    groups = {
        "posters": [
            ("Music / artist posters", r"music|artist|singer|vinyl|cd|clairo|lana|drake|michael|weeknd"),
            ("Movies & TV", r"movie|tv show|marvel|star wars|fortnite poster"),
            ("Italian Brainrot", r"brainrot|branrot"),
            ("Ocean / forest / abstract", r"ocean|forest|abstract|aquatic"),
            ("Sports posters", r"basketball|sport"),
            ("Comics & pop culture", r"comic|pop culture"),
            ("Programming art", r"program"),
        ],
        "snacks": [
            ("Chips & spicy snacks", r"chip|takis|cheetos|doritos|lays"),
            ("Candy & chocolate", r"candy|chocolate|gumm|nerd|reeses|m&ms|smarties|sour patch"),
            ("Cookies", r"cookie|oreos|nutter"),
            ("Drinks", r"caprisun|gatorade|boba|juice|dew|drink"),
            ("Fruit & cereal", r"fruit|froot|bell pepper"),
        ],
        "prizes": [
            ("Squishies & fidgets", r"squish|fidget|figit|needoh|nedoe"),
            ("Candy & snacks", r"candy|food|chips|brownie|soda"),
            ("Pokemon cards", r"pokemon"),
            ("Gift cards", r"gift\s*card|giftcrad"),
            ("Keychains, stickers, toys", r"keychain|sticker|toy|shopkin|hatchimal"),
            ("Homework pass / bonus points", r"homework|bonus|grade"),
        ],
    }
    counts = Counter()
    for value in values:
        text = value.lower()
        matched = False
        for label, pattern in groups[kind]:
            if re.search(pattern, text):
                counts[label] += 1
                matched = True
        if not matched and not is_empty(value):
            counts["Other fun ideas"] += 1
    return [{"label": k, "count": v} for k, v in counts.most_common()]


def main() -> None:
    students = []
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, raw in enumerate(reader, start=1):
            row = {
                "first": clean(raw["What's your First Name?"]),
                "last": clean(raw["What's your Last Name?"]),
                "posters": titleish(raw["What kind of art / posters should we get for our room?"]),
                "snacks": titleish(raw["What are your favorite snacks?"]),
                "prizes": titleish(raw["What are some other fun, small prizes we should get for game winners?"]),
                "techLove": int(clean(raw["Do you enjoy learning about technology and how things work?"]) or 0),
                "coding": clean(raw["Have you done any coding before at all?"]),
                "apps": titleish(raw["What's your favorite App?"]),
                "websites": titleish(raw["What's your favorite Website?"]),
                "screenTime": screen_bucket(raw["How much time per week do you watch movies, stream shows or videos, or youtube?"]),
                "shows": titleish(raw["What are your favorite shows to watch?"]),
                "music": titleish(raw["Who are some of your favorite bands, musicians and/or artists?"]),
                "games": titleish(raw["Name two of your favorite games to play"]),
                "reads": clean(raw["Do you like to read?"]),
                "book": "" if is_empty(raw["What's your favorite book?"]) else titleish(raw["What's your favorite book?"]),
                "hobbies": titleish(raw["What are your hobbies and interests? Any after school activities? Do you have or have had a job? Name at least 4:"]),
                "hopes": titleish(raw["What are you excited about, and what do you hope to learn in this class?"]),
            }
            student = {
                "id": f"s{i:02d}",
                "displayName": display_name(row["first"], row["last"]),
                "initials": initials(row["first"], row["last"]),
                "posters": row["posters"],
                "snacks": row["snacks"],
                "prizes": row["prizes"],
                "techLove": row["techLove"],
                "coding": coding_bucket(row["coding"]),
                "codingRaw": row["coding"],
                "apps": "" if is_empty(row["apps"]) else row["apps"],
                "websites": "" if is_empty(row["websites"]) else row["websites"],
                "screenTime": row["screenTime"],
                "shows": "" if is_empty(row["shows"]) else row["shows"],
                "music": "" if is_empty(row["music"]) else row["music"],
                "games": "" if is_empty(row["games"]) else row["games"],
                "reads": row["reads"],
                "book": row["book"],
                "hobbies": row["hobbies"],
                "hopes": row["hopes"],
                "tags": make_tags(row),
                "tokens": tokens_for(row),
            }
            students.append(student)

    data = {
        "className": "CSD Class Hub",
        "tagline": f"{len(students)} classmates. One room. Chips, Roblox, and a whole lot of curiosity.",
        "students": students,
        "wishlist": {
            "posters": wishlist_items([s["posters"] for s in students], "posters"),
            "snacks": wishlist_items([s["snacks"] for s in students], "snacks"),
            "prizes": wishlist_items([s["prizes"] for s in students], "prizes"),
        },
    }

    js = "window.CSD_DATA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n"
    OUT_PATH.write_text(js, encoding="utf-8")
    print(f"Wrote {len(students)} students to {OUT_PATH}")


if __name__ == "__main__":
    main()
