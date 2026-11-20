const STORE_KEY = 'kindness-conundrum-v1'

const SOLUTION = { who: 'theo', what: 'radio', where: 'library', when: 'tue1210', why: 'watch' }

const CATEGORIES = [
  {
    id: 'who',
    label: 'Who',
    options: [
      { id: 'maya', label: 'Maya Lin' },
      { id: 'theo', label: 'Theo Brooks' },
      { id: 'rosie', label: 'Rosie Nguyen' },
      { id: 'alvarez', label: 'Ms. Alvarez' },
      { id: 'dunn', label: 'Coach Dunn' },
      { id: 'patel', label: 'Mr. Patel' }
    ]
  },
  {
    id: 'what',
    label: 'What',
    options: [
      { id: 'pie', label: 'A pumpkin pie' },
      { id: 'scarf', label: 'A hand-knit scarf' },
      { id: 'radio', label: 'His broken radio, repaired' },
      { id: 'portrait', label: 'A painted portrait' },
      { id: 'cocoa', label: 'A thermos of hot cocoa' },
      { id: 'website', label: 'A thank-you website' }
    ]
  },
  {
    id: 'where',
    label: 'Where',
    options: [
      { id: 'closet', label: 'Custodian closet' },
      { id: 'cafeteria', label: 'Cafeteria' },
      { id: 'library', label: 'Library' },
      { id: 'gym', label: 'Gym' },
      { id: 'lab', label: 'Computer lab' },
      { id: 'office', label: 'Front office' }
    ]
  },
  {
    id: 'when',
    label: 'When',
    options: [
      { id: 'mon900', label: 'Monday · 9:00 PM' },
      { id: 'tue720', label: 'Tuesday · 7:20 AM' },
      { id: 'tue1045', label: 'Tuesday · 10:45 AM' },
      { id: 'tue1210', label: 'Tuesday · 12:10 PM' },
      { id: 'tue240', label: 'Tuesday · 2:40 PM' }
    ]
  },
  {
    id: 'why',
    label: 'Why',
    options: [
      { id: 'watch', label: 'Ray found & returned something precious' },
      { id: 'gym', label: 'Ray stayed late to unlock the gym' },
      { id: 'morning', label: 'Ray greets them by name every morning' },
      { id: 'spill', label: 'Ray cleaned up their huge spill' },
      { id: 'retire', label: 'Ray is retiring this year' }
    ]
  }
]

const CAST = [
  {
    icon: '🧹',
    name: 'Mr. Ray Okafor',
    role: 'Night custodian · 27 years',
    bio: 'Works 3:00 to 11:30 PM. Knows every squeaky door in the building. The one who got the gift.',
    victim: true
  },
  {
    icon: '🤖',
    name: 'Maya Lin',
    role: 'Student · Robotics captain',
    bio: 'Codes everything. Has opinions about semicolons.'
  },
  {
    icon: '🏈',
    name: 'Theo Brooks',
    role: 'Student · Football',
    bio: 'Quiet off the field. Weekends at his uncle’s shop.'
  },
  {
    icon: '🎨',
    name: 'Rosie Nguyen',
    role: 'Student · Art club',
    bio: 'Always has paint on her sleeves. Draws everyone.'
  },
  {
    icon: '🥧',
    name: 'Ms. Alvarez',
    role: 'Cafeteria manager',
    bio: 'Runs the lunch line like a ship captain. Famous pies.'
  },
  {
    icon: '🏐',
    name: 'Coach Dunn',
    role: 'PE teacher · Volleyball coach',
    bio: 'Whistle on, always. Secretly knits on the team bus.'
  },
  {
    icon: '📚',
    name: 'Mr. Patel',
    role: 'Librarian',
    bio: 'Shelves books like it’s a sport. Shares his newspaper.'
  }
]

const EVIDENCE = [
  {
    id: 'voicemail',
    icon: '📞',
    title: 'Ray’s voicemail',
    tag: 'Recording',
    body: `
      <p class='kc-meta'>Front office answering machine · Tuesday · 5:52 PM</p>
      <blockquote class='kc-quote'>
        “Hey, it’s Ray. Uh, I don’t know who to say this to, so I’m saying it to the machine.
        I sat down for my break tonight, right where I always sit, and there it was. With a note.
        <br /><br />
        For the first time in a month, I won’t be working in silence.
        <br /><br />
        And it wasn’t there last night, either. I do my final walk-through at 11:30 and I would’ve
        seen it. Whoever you are… thank you.
        <br /><br />
        Oh, and before the rumors start: no, I am <em>not</em> retiring. Ten more years, minimum.
        Happy Thanksgiving.”
      </blockquote>`
  },
  {
    id: 'note',
    icon: '✉️',
    title: 'The note',
    tag: 'Physical',
    body: `
      <div class='kc-card-note'>
        MR. RAY —<br />
        YOU PROBABLY DON’T REMEMBER WHAT YOU DID FOR ME.<br />
        I DO. EVERY DAY.<br />
        HAPPY THANKSGIVING.<br />
        — A GRATEFUL TURKEY 🦃
      </div>
      <p><strong>Detective notes:</strong></p>
      <ul>
        <li>Index card. Pencil. Neat <strong>block capital letters</strong>.</li>
        <li>No paint, no glitter, no flour.</li>
        <li>A tiny brown <strong>scorch mark</strong> on one corner, about the size of a pencil tip. It smells a little like burnt metal.</li>
      </ul>`
  },
  {
    id: 'rumors',
    icon: '🗣️',
    title: 'Hallway rumors',
    tag: 'Rumors',
    body: `
      <p class='kc-meta'>Overheard in the class group chat Tuesday night, after word got out</p>
      <ul class='kc-rumors'>
        <li>“Ms. Alvarez baked him a secret pumpkin pie. Obviously.”</li>
        <li>“Rosie’s been painting Mr. Ray for weeks. It’s the portrait.”</li>
        <li>“Maya coded him a whole thank-you website. With a QR code.”</li>
        <li>“Coach Dunn knits on the bus. It’s a scarf. Has to be.”</li>
        <li>“Somebody saw a thermos of hot cocoa in the gym.”</li>
        <li>“Mr. Patel and Ray are tight. Librarians are sneaky-nice.”</li>
      </ul>
      <p><em>Rumors are where you start, not where you finish.</em></p>`
  },
  {
    id: 'worklog',
    icon: '📋',
    title: 'Custodial work log',
    tag: 'Data',
    body: `
      <p class='kc-meta'>Clipboard hanging in the custodian closet. Ray’s handwriting.</p>
      <table class='kc-table'>
        <thead><tr><th>Date</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td>Oct 23 · 9:40 PM</td><td>Radio fell off my cart in the Wing B stairwell. Speaker cracked. Won’t play. Quiet nights for a while. — R.O.</td></tr>
          <tr><td>Oct 24</td><td>Asked at the pawn shop. Too expensive to fix. Oh well.</td></tr>
          <tr><td>Nov 10</td><td>Gym bleachers: 2 water bottles, 1 retainer (gross).</td></tr>
          <tr><td>Nov 13</td><td>My busted radio is gone from my cart. Somebody took it?? Not like it worked anyway.</td></tr>
          <tr><td>Nov 20</td><td>Library heater fixed. Mr. P says thanks.</td></tr>
        </tbody>
      </table>`
  },
  {
    id: 'alvarez',
    icon: '🥧',
    title: 'Ms. Alvarez’s statement',
    tag: 'Statement',
    body: `
      <p class='kc-meta'>Cafeteria manager · interviewed in the kitchen</p>
      <blockquote class='kc-quote'>
        “A pie? Honey, I bake forty pumpkin pies for the staff Thanksgiving lunch. Ray got a slice in
        the staff room like everybody else. That’s not a secret.
        <br /><br />
        Tuesday at lunch I was on the serving line, 11:30 to 1:00, same as every day. Ask anyone who
        ate a turkey taco.
        <br /><br />
        I’ll tell you why I love Ray, though. Back in September our giant gravy pot tipped over and
        flooded my whole kitchen. Ray mopped for two hours. Only real spill disaster we’ve had all year.
        <br /><br />
        And good luck sending that man anything techy. He still uses a <strong>flip phone</strong>.
        No apps. No internet. No QR codes.”
      </blockquote>`
  },
  {
    id: 'dunn',
    icon: '🏐',
    title: 'Coach Dunn’s statement',
    tag: 'Statement',
    body: `
      <p class='kc-meta'>PE teacher & volleyball coach · interviewed in the gym</p>
      <blockquote class='kc-quote'>
        “A scarf? Yeah, I knit on the team bus. That one’s for my mom.
        <br /><br />
        Look, Ray did my <strong>volleyball team</strong> a huge favor in October. He stayed until ten
        so we could finish practice before playoffs. The girls already thanked him: a signed game
        ball. It’s sitting on his cart right now.
        <br /><br />
        Tuesday at lunch? I was wherever the duty roster put me. Not glamorous, I’ll tell you that.”
      </blockquote>`
  },
  {
    id: 'patel',
    icon: '📚',
    title: 'Mr. Patel’s statement',
    tag: 'Statement',
    body: `
      <p class='kc-meta'>Librarian · interviewed at the circulation desk</p>
      <blockquote class='kc-quote'>
        “Tuesday I unlocked the library at 7:15 and spent the morning shelving book fair books.
        <br /><br />
        Ray takes his break in here most nights. I leave him the newspaper.
        <br /><br />
        Was it me? I wish. I can’t even change the printer toner without calling for help. I don’t
        fix things, I shelve them.
        <br /><br />
        At lunch I’m on duty. I leave the library around noon and get back around 12:45.”
      </blockquote>`
  },
  {
    id: 'rosie',
    icon: '🎨',
    title: 'Rosie Nguyen’s statement',
    tag: 'Statement',
    body: `
      <p class='kc-meta'>Student · art club · interviewed in the art room (paint on both sleeves)</p>
      <blockquote class='kc-quote'>
        “Yeah, I was in the library at lunch. I’m painting a portrait of Mr. Ray for the winter art
        show. It’s due in December and it is <em>not even close</em> to done, so it’s definitely not that.
        <br /><br />
        I sit at the front table by the printer. Around 12:10 a guy in a <strong>football hoodie</strong>
        walked straight to the back table, set down a box, and left fast. I didn’t see his face.
        <br /><br />
        Oh, and Mr. Ray didn’t find my lost sketchbook. Ms. Kim did. Mr. Ray just always waves to me
        when I leave art club.”
      </blockquote>`
  },
  {
    id: 'theo',
    icon: '🏈',
    title: 'Theo Brooks’s statement',
    tag: 'Statement',
    body: `
      <p class='kc-meta'>Student · football · interviewed outside the locker room</p>
      <blockquote class='kc-quote'>
        “Library at lunch? I was studying for chem. That’s it.
        <br /><br />
        Mr. Ray? I mean… he’s cool. I barely know him.
        <br /><br />
        And I’m a football guy. I don’t know anything about fixing stuff. Can I go?”
      </blockquote>
      <p><strong>Detective notes:</strong> Wearing the team football hoodie. Keeps his right hand in his
      pocket. When he finally takes it out, there’s a small <strong>burn blister</strong> on his thumb.</p>`
  },
  {
    id: 'shift',
    icon: '🗓️',
    title: 'Ray’s shift card',
    tag: 'Data',
    lock: {
      kind: 'Code',
      prompt: `
        <p>Ray’s shift card is in his locker. The combination is written in <strong>binary</strong>:</p>
        <p class='kc-big-code'>11010</p>
        <p>What number is that in regular (decimal) numbers?</p>`,
      hint: 'Binary place values from right to left are 1, 2, 4, 8, 16. Add up the places that have a 1.',
      answers: ['26', 'twentysix']
    },
    body: `
      <p class='kc-meta'>Taped inside Ray’s locker</p>
      <table class='kc-table'>
        <thead><tr><th>Time</th><th>Ray’s routine (every weeknight)</th></tr></thead>
        <tbody>
          <tr><td>3:00 PM</td><td>Clock in at the front office</td></tr>
          <tr><td>3:15 PM</td><td>Gym & locker rooms</td></tr>
          <tr><td>4:30 PM</td><td>Cafeteria: mop & stack chairs</td></tr>
          <tr><td>5:30 PM</td><td><strong>BREAK: library, back table by the window.</strong> Mr. P leaves me the newspaper.</td></tr>
          <tr><td>6:00 PM</td><td>Wing B classrooms</td></tr>
          <tr><td>8:00 PM</td><td>Computer lab & Wing C</td></tr>
          <tr><td>11:30 PM</td><td>Final walk-through, library last. Lock up.</td></tr>
        </tbody>
      </table>
      <p class='kc-scrawl'>Mornings? Never met ’em. Night owl for 27 years. — R.</p>`
  },
  {
    id: 'calendar',
    icon: '📅',
    title: 'Library booking calendar',
    tag: 'Data',
    lock: {
      kind: 'Code',
      prompt: `
        <p>The calendar is on Mr. Patel’s computer. The password is whatever this code prints:</p>
        <pre class='kc-code'>let pies = 3
pies = pies * 2 + 1
console.log(pies)</pre>`,
      hint: 'Do the multiplication first, then add 1. The new value replaces the old one.',
      answers: ['7', 'seven']
    },
    body: `
      <p class='kc-meta'>Tuesday bookings</p>
      <table class='kc-table'>
        <thead><tr><th>Time</th><th>Booking</th></tr></thead>
        <tbody>
          <tr><td>7:15 – 7:45</td><td>Open (Mr. Patel shelving)</td></tr>
          <tr><td>7:50 – 8:40</td><td>Study hall, front tables</td></tr>
          <tr><td>10:45 – 11:35</td><td>Ms. Kim’s English 9 research lesson at the <strong>back table</strong>, with Mr. Patel (32 students)</td></tr>
          <tr><td>12:00 – 12:45</td><td>Lunch: open study, <strong>unsupervised</strong></td></tr>
          <tr><td>2:28 – 3:30</td><td><strong>CLOSED & LOCKED</strong> for staff meeting</td></tr>
        </tbody>
      </table>
      <p class='kc-scrawl'>Sticky from Ms. Kim: “Back table was totally clear for our lesson, nothing on it. Thanks, Mr. P!”</p>`
  },
  {
    id: 'duty',
    icon: '🦺',
    title: 'Lunch duty roster',
    tag: 'Data',
    lock: {
      kind: 'Riddle',
      prompt: `
        <p>The roster is pinned behind a sign with a riddle on it:</p>
        <blockquote class='kc-quote'>“I have ears, but I cannot hear. I get buttered and passed around the Thanksgiving table. What am I?”</blockquote>`,
      hint: 'It grows on a tall stalk. Its “ears” have kernels.',
      answers: ['corn', 'cornonthecob', 'earofcorn', 'ears of corn', 'maize'],
      contains: 'corn'
    },
    body: `
      <p class='kc-meta'>Tuesday · 12:00 – 12:45</p>
      <table class='kc-table'>
        <thead><tr><th>Post</th><th>Staff</th></tr></thead>
        <tbody>
          <tr><td>Cafeteria floor</td><td>Mr. Patel</td></tr>
          <tr><td>Serving line</td><td>Ms. Alvarez & kitchen crew</td></tr>
          <tr><td>Room 112 lunch detention</td><td>Coach Dunn (3 students, attendance signed 12:44)</td></tr>
          <tr><td>Library</td><td><em>Unsupervised: open study</em></td></tr>
        </tbody>
      </table>`
  },
  {
    id: 'trip',
    icon: '🚌',
    title: 'Robotics field trip slip',
    tag: 'Data',
    lock: {
      kind: 'Code',
      prompt: `
        <p>The slip is in a folder locked with a true/false code. Type what this prints:</p>
        <pre class='kc-code'>const hungry = true
const fullOfPie = false
console.log(hungry && !fullOfPie)</pre>`,
      hint: '!fullOfPie flips false to true. && is only true when both sides are true.',
      answers: ['true']
    },
    body: `
      <p class='kc-meta'>Field trip permission slip · signed by the office</p>
      <table class='kc-table'>
        <tbody>
          <tr><td>Event</td><td>Robotics Regional Championship (two towns over)</td></tr>
          <tr><td>Date</td><td>Tuesday</td></tr>
          <tr><td>Bus</td><td>Leaves 6:15 AM · returns 7:30 PM</td></tr>
          <tr><td>Team</td><td><strong>Maya Lin (captain)</strong> + 5 students</td></tr>
          <tr><td>Chaperone</td><td>Mr. Ortiz</td></tr>
        </tbody>
      </table>
      <p class='kc-scrawl'>Doodle on the back in Maya’s handwriting: “finish Mr. Ray’s thank-you website AFTER break!!”</p>`
  },
  {
    id: 'doorlog',
    icon: '🚪',
    title: 'Library door scanner',
    tag: 'Data',
    lock: {
      kind: 'Code',
      prompt: `
        <p>The scanner export needs a passcode. It’s the value of <code>turkeys</code> at the end:</p>
        <pre class='kc-code'>let turkeys = 0
for (let i = 0; i &lt; 5; i++) {
  turkeys = turkeys + 2
}</pre>`,
      hint: 'The loop runs once for i = 0, 1, 2, 3, 4. That’s five times. Each time adds 2.',
      answers: ['10', 'ten']
    },
    body: `
      <p class='kc-meta'>badge_scans_library_tuesday.csv · every badge scans IN and OUT</p>
      <table class='kc-table kc-mono'>
        <thead><tr><th>time</th><th>badge</th><th>dir</th></tr></thead>
        <tbody>
          <tr><td>07:15</td><td>PATEL_A</td><td>IN</td></tr>
          <tr><td>07:48</td><td>STUDYHALL (x18)</td><td>IN</td></tr>
          <tr><td>08:41</td><td>STUDYHALL (x18)</td><td>OUT</td></tr>
          <tr><td>10:44</td><td>KIM_J + ENG9 (x32)</td><td>IN</td></tr>
          <tr><td>11:36</td><td>KIM_J + ENG9 (x32)</td><td>OUT</td></tr>
          <tr><td>11:58</td><td>PATEL_A</td><td>OUT</td></tr>
          <tr><td>12:04</td><td>NGUYEN_R</td><td>IN</td></tr>
          <tr><td>12:07</td><td>BROOKS_T</td><td>IN</td></tr>
          <tr><td>12:13</td><td>BROOKS_T</td><td>OUT</td></tr>
          <tr><td>12:42</td><td>NGUYEN_R</td><td>OUT</td></tr>
          <tr><td>12:47</td><td>PATEL_A</td><td>IN</td></tr>
          <tr><td>14:28</td><td>PATEL_A</td><td>OUT (door locked)</td></tr>
          <tr><td>15:31</td><td>PATEL_A</td><td>IN (unlocked)</td></tr>
          <tr><td>15:44</td><td>PATEL_A</td><td>OUT</td></tr>
          <tr><td>17:29</td><td>OKAFOR_R</td><td>IN</td></tr>
        </tbody>
      </table>
      <p class='kc-meta'>No other badges scanned on Tuesday.</p>`
  },
  {
    id: 'receipt',
    icon: '🧾',
    title: 'A crumpled receipt',
    tag: 'Physical',
    lock: {
      kind: 'Trivia',
      prompt: `
        <p>The receipt is stuck inside a trivia lockbox:</p>
        <blockquote class='kc-quote'>In what year did the Pilgrims and the Wampanoag people share the harvest feast that’s often called the “first Thanksgiving”?</blockquote>`,
      hint: 'The Mayflower landed in 1620. The feast was the next autumn, after their first harvest.',
      answers: ['1621']
    },
    body: `
      <p class='kc-meta'>Found in the library trash can next to the back table</p>
      <div class='kc-receipt'>
        <p class='kc-receipt-head'>BROOKS FAMILY ELECTRONICS<br /><span>“We fix what others toss”</span></p>
        <p>SATURDAY · 11:42 AM</p>
        <p class='kc-receipt-row'><span>1 × Replacement speaker 3"</span><span>$6.49</span></p>
        <p class='kc-receipt-row'><span>2 × 9V battery</span><span>$5.98</span></p>
        <p class='kc-receipt-row'><span>1 × Solder, small roll</span><span>$3.25</span></p>
        <p class='kc-receipt-row'><span>Family discount −20%</span><span>−$3.14</span></p>
        <p class='kc-receipt-row kc-receipt-total'><span>TOTAL</span><span>$12.58</span></p>
        <p>CASHIER: DRE · CUSTOMER: THEO</p>
      </div>
      <p><strong>On the back, in pencil block capitals:</strong> “RED WIRE → + ✓ &nbsp;BLACK WIRE → − ✓ &nbsp;NEW SPEAKER ✓”</p>`
  },
  {
    id: 'workorder',
    icon: '🔧',
    title: 'Repair shop work order',
    tag: 'Physical',
    lock: {
      kind: 'Math',
      prompt: `
        <p>The work order is in a folder sealed with a math lock:</p>
        <blockquote class='kc-quote'>A 16-pound turkey needs to roast for 15 minutes per pound. How many <strong>hours</strong> is that?</blockquote>`,
      hint: 'First find the minutes: 16 × 15. Then divide by 60.',
      answers: ['4', 'four', '4hours', 'fourhours', '4hrs', '240', '240minutes']
    },
    body: `
      <p class='kc-meta'>Brooks Family Electronics · Work order #1124</p>
      <table class='kc-table'>
        <tbody>
          <tr><td>Customer</td><td>Theo (nephew)</td></tr>
          <tr><td>Item</td><td>Old silver radio, cracked speaker. Brought in Nov 13. “Belongs to a friend at school.”</td></tr>
          <tr><td>Work done</td><td>Speaker replaced, antenna glued, new batteries, cleaned.</td></tr>
          <tr><td>Bench time</td><td>3 hours</td></tr>
        </tbody>
      </table>
      <p class='kc-scrawl'>Note from Uncle Dre: “Theo did the whole repair himself. I just watched. Proud of that kid.”</p>`
  },
  {
    id: 'lostfound',
    icon: '📦',
    title: 'Lost & found log',
    tag: 'Data',
    lock: {
      kind: 'Trivia',
      prompt: `
        <p>The lost & found binder has a combination word:</p>
        <blockquote class='kc-quote'>What was the name of the ship that carried the Pilgrims across the Atlantic in 1620?</blockquote>`,
      hint: 'It’s named after a spring month and a flower.',
      answers: ['mayflower', 'themayflower']
    },
    body: `
      <p class='kc-meta'>Front office lost & found binder · this school year</p>
      <table class='kc-table'>
        <thead><tr><th>Date</th><th>Item</th><th>Found by</th><th>Returned to</th></tr></thead>
        <tbody>
          <tr><td>Sep 9</td><td>Purple water bottle</td><td>Front office</td><td>Nobody claimed it</td></tr>
          <tr><td>Sep 22</td><td>Sketchbook full of portraits</td><td>Ms. Kim</td><td>Rosie N.</td></tr>
          <tr><td>Oct 6</td><td>Gold pocket watch, engraved “For T. — Love, Grandpa”</td><td>R. Okafor (night shift), in the football bleacher trash</td><td>Theo B.</td></tr>
          <tr><td>Oct 30</td><td>Robotics controller</td><td>Coach Dunn</td><td>Maya L.</td></tr>
          <tr><td>Nov 3</td><td>Volleyball knee pads (×4)</td><td>R. Okafor</td><td>Coach Dunn’s team</td></tr>
        </tbody>
      </table>
      <p class='kc-scrawl'>Note stapled to Oct 6: “Kid said it was his late grandpa’s. Took an hour digging through the bleacher trash. Worth it. — R.”</p>`
  }
]

const HINTS = [
  'Start with Ray’s voicemail. It hints at WHERE (“where I always sit”), WHEN (not Monday night), and WHAT (“not working in silence”).',
  'Which gifts would end Ray’s silence? Then check the work log and Ms. Alvarez for why one of those two can’t be it.',
  'Ray found it on his break. The shift card (🔒) says exactly where Ray sits on break.',
  'For WHEN: the library calendar (🔒) shows when that table was clear and when the room was locked.',
  'For WHO: who was actually in the library at that time? The door scanner (🔒) knows. Rosie’s statement and the receipt split the last two.',
  'For WHY: Ray only works nights. Match each favor Ray did to the person he did it for. The lost & found log (🔒) helps.'
]

const MARK_CYCLE = ['', 'no', 'yes']

function createState() {
  return {
    started: false,
    startedAt: 0,
    finishedMs: 0,
    unlocked: {},
    read: {},
    marks: {},
    accusations: [],
    solved: false,
    hintIndex: 0
  }
}

let state = loadState()
let tick = null
let openId = ''

function $(sel, root) {
  return (root || document).querySelector(sel)
}

function $all(sel, root) {
  return Array.from((root || document).querySelectorAll(sel))
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY))
    if (saved && typeof saved === 'object') return Object.assign(createState(), saved)
  } catch (err) {
    // A bad saved game just starts fresh.
  }
  return createState()
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state))
  } catch (err) {
    // Private browsing can block storage; the game still works without saving.
  }
}

function evidenceById(id) {
  return EVIDENCE.find(function (item) {
    return item.id === id
  })
}

function optionLabel(categoryId, optionId) {
  const cat = CATEGORIES.find(function (c) {
    return c.id === categoryId
  })
  const opt = cat.options.find(function (o) {
    return o.id === optionId
  })
  return opt ? opt.label : ''
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000)
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return m + ':' + s
}

function elapsed() {
  if (!state.startedAt) return 0
  if (state.solved) return state.finishedMs
  return Date.now() - state.startedAt
}

function startTimer() {
  if (tick) clearInterval(tick)
  $('#timer').textContent = formatTime(elapsed())
  tick = setInterval(function () {
    $('#timer').textContent = formatTime(elapsed())
  }, 500)
}

function setOverlay(id, open) {
  $('#' + id).classList.toggle('is-open', open)
  document.body.classList.toggle('has-overlay', Boolean($('.kc-overlay.is-open')))
}

function isLocked(item) {
  return Boolean(item.lock) && !state.unlocked[item.id]
}

function renderCast() {
  $('#cast-grid').innerHTML = CAST.map(function (person) {
    return `
      <article class='kc-person${person.victim ? ' is-victim' : ''}'>
        <span class='kc-person-icon' aria-hidden='true'>${person.icon}</span>
        <h3>${person.name}</h3>
        <p class='kc-person-role'>${person.role}</p>
        <p>${person.bio}</p>
      </article>`
  }).join('')
}

function renderEvidence() {
  $('#evidence-grid').innerHTML = EVIDENCE.map(function (item, index) {
    const locked = isLocked(item)
    const classes = ['kc-ev']
    if (locked) classes.push('is-locked')
    else if (!state.read[item.id]) classes.push('is-new')
    const status = locked ? '🔒 ' + item.lock.kind : state.read[item.id] ? 'Read' : 'New'
    return `
      <button type='button' class='${classes.join(' ')}' data-ev='${item.id}'>
        <span class='kc-ev-num'>#${String(index + 1).padStart(2, '0')}</span>
        <span class='kc-ev-icon' aria-hidden='true'>${item.icon}</span>
        <span class='kc-ev-title'>${item.title}</span>
        <span class='kc-ev-tag'>${item.tag} · ${status}</span>
      </button>`
  }).join('')
  renderStats()
}

function renderStats() {
  const locks = EVIDENCE.filter(function (item) {
    return item.lock
  })
  $('#stat-locks').textContent = locks.length
  $('#stat-unlocked').textContent = locks.filter(function (item) {
    return state.unlocked[item.id]
  }).length
  $('#stat-total').textContent = EVIDENCE.length
  $('#stat-read').textContent = Object.keys(state.read).length
  $('#stat-accuse').textContent = state.accusations.length
}

function renderModal() {
  const item = evidenceById(openId)
  if (!item) return
  const body = $('#modal-body')
  if (isLocked(item)) {
    body.innerHTML = `
      <p class='kicker'>🔒 Locked · ${item.lock.kind} challenge</p>
      <h2>${item.icon} ${item.title}</h2>
      <div class='kc-lock-prompt'>${item.lock.prompt}</div>
      <form class='kc-lock-row' id='lock-form'>
        <label class='sr-only' for='lock-input'>Answer</label>
        <input id='lock-input' type='text' autocomplete='off' spellcheck='false' placeholder='Answer' />
        <button class='btn btn-small btn-primary' type='submit'>Unlock</button>
        <button class='btn btn-small btn-ghost' type='button' id='lock-hint'>Hint</button>
      </form>
      <p class='kc-feedback' id='lock-feedback' aria-live='polite'></p>`
    const input = $('#lock-input')
    if (input) input.focus()
    return
  }
  state.read[item.id] = true
  saveState()
  body.innerHTML = `
    <p class='kicker'>${item.tag}${item.lock ? ' · unlocked' : ''}</p>
    <h2>${item.icon} ${item.title}</h2>
    <div class='kc-ev-body'>${item.body}</div>`
}

function openEvidence(id) {
  openId = id
  renderModal()
  const modal = $('#evidence-modal')
  if (!modal.open) modal.showModal()
}

function closeEvidence() {
  const modal = $('#evidence-modal')
  if (modal.open) modal.close()
}

function tryUnlock(raw) {
  const item = evidenceById(openId)
  if (!item || !item.lock) return
  const guess = normalize(raw)
  const feedback = $('#lock-feedback')
  if (!guess) return
  const ok =
    item.lock.answers.some(function (answer) {
      return normalize(answer) === guess
    }) ||
    (item.lock.contains && guess.includes(item.lock.contains))
  if (ok) {
    state.unlocked[item.id] = true
    saveState()
    renderModal()
    renderEvidence()
    return
  }
  feedback.className = 'kc-feedback is-bad'
  feedback.textContent = 'Not quite. Talk it over, or try the hint.'
}

function showLockHint() {
  const item = evidenceById(openId)
  if (!item || !item.lock) return
  const feedback = $('#lock-feedback')
  feedback.className = 'kc-feedback is-hint'
  feedback.textContent = 'Hint: ' + item.lock.hint
}

function renderBoard() {
  $('#board-grid').innerHTML = CATEGORIES.map(function (cat) {
    const buttons = cat.options
      .map(function (opt) {
        const mark = state.marks[cat.id + ':' + opt.id] || ''
        const symbol = mark === 'no' ? '✗' : mark === 'yes' ? '★' : ''
        return `
          <button type='button' class='kc-mark${mark ? ' is-' + mark : ''}' data-mark='${cat.id}:${opt.id}'>
            <span class='kc-mark-symbol' aria-hidden='true'>${symbol}</span>
            <span>${opt.label}</span>
          </button>`
      })
      .join('')
    return `
      <div class='kc-board-cat'>
        <h3>${cat.label}</h3>
        <div class='kc-board-options'>${buttons}</div>
      </div>`
  }).join('')
}

function cycleMark(key) {
  const current = state.marks[key] || ''
  const next = MARK_CYCLE[(MARK_CYCLE.indexOf(current) + 1) % MARK_CYCLE.length]
  if (next) state.marks[key] = next
  else delete state.marks[key]
  saveState()
  renderBoard()
}

function renderAccuseFields() {
  $('#accuse-fields').innerHTML = CATEGORIES.map(function (cat) {
    const options = cat.options
      .map(function (opt) {
        return `<option value='${opt.id}'>${opt.label}</option>`
      })
      .join('')
    return `
      <label class='kc-accuse-field'>
        <span>${cat.label}</span>
        <select name='${cat.id}' required>
          <option value=''>Choose…</option>
          ${options}
        </select>
      </label>`
  }).join('')
}

function renderHistory() {
  $('#accuse-history').innerHTML = state.accusations
    .map(function (entry, index) {
      const picks = CATEGORIES.map(function (cat) {
        return optionLabel(cat.id, entry.picks[cat.id])
      }).join(' · ')
      return `<li><strong>#${index + 1}: ${entry.correct} / 5 right</strong><span>${picks}</span></li>`
    })
    .join('')
}

function accuse(event) {
  event.preventDefault()
  const form = event.target
  const picks = {}
  CATEGORIES.forEach(function (cat) {
    picks[cat.id] = form.elements[cat.id].value
  })
  const correct = CATEGORIES.filter(function (cat) {
    return picks[cat.id] === SOLUTION[cat.id]
  }).length
  state.accusations.push({ picks: picks, correct: correct })
  const feedback = $('#accuse-feedback')
  if (correct === CATEGORIES.length) {
    state.solved = true
    state.finishedMs = Date.now() - state.startedAt
    feedback.className = 'kc-feedback is-good'
    feedback.textContent = 'All five! Case closed.'
    showWin()
  } else {
    feedback.className = 'kc-feedback is-bad'
    feedback.textContent =
      correct + ' of 5 are right. Which ones? That’s for the class to figure out.'
  }
  saveState()
  renderHistory()
  renderStats()
}

function showWin() {
  const minutes = Math.max(1, Math.round(state.finishedMs / 60000))
  const tries = state.accusations.length
  $('#win-time').textContent =
    'Solved in ' +
    formatTime(state.finishedMs) +
    ' (about ' +
    minutes +
    ' min) with ' +
    tries +
    (tries === 1 ? ' accusation.' : ' accusations.')
  $('#timer').textContent = formatTime(state.finishedMs)
  setOverlay('win', true)
}

function showHint() {
  const banner = $('#hint-banner')
  const next = Math.min(state.hintIndex, HINTS.length - 1)
  banner.hidden = false
  banner.textContent = 'Hint ' + (next + 1) + ' of ' + HINTS.length + ': ' + HINTS[next]
  if (state.hintIndex < HINTS.length - 1) state.hintIndex += 1
  saveState()
}

function startGame() {
  if (!state.started) {
    state.started = true
    state.startedAt = Date.now()
    saveState()
  }
  setOverlay('intro', false)
  startTimer()
}

function resetGame() {
  if (!confirm('Start the case over? This clears the board, the locks, and all accusations.'))
    return
  state = createState()
  saveState()
  if (tick) clearInterval(tick)
  $('#timer').textContent = '00:00'
  $('#hint-banner').hidden = true
  $('#accuse-feedback').textContent = ''
  $('#accuse-form').reset()
  setOverlay('win', false)
  renderAll()
  setOverlay('intro', true)
}

function renderAll() {
  renderEvidence()
  renderBoard()
  renderHistory()
}

function init() {
  renderCast()
  renderAccuseFields()
  renderAll()

  $('#evidence-grid').addEventListener('click', function (event) {
    const btn = event.target.closest('[data-ev]')
    if (btn) openEvidence(btn.dataset.ev)
  })
  $('#modal-body').addEventListener('submit', function (event) {
    if (event.target.id !== 'lock-form') return
    event.preventDefault()
    tryUnlock($('#lock-input').value)
  })
  $('#modal-body').addEventListener('click', function (event) {
    if (event.target.id === 'lock-hint') showLockHint()
  })
  $('#modal-close').addEventListener('click', closeEvidence)
  $('#evidence-modal').addEventListener('close', renderEvidence)
  $('#evidence-modal').addEventListener('click', function (event) {
    if (event.target.id === 'evidence-modal') closeEvidence()
  })
  $('#board-grid').addEventListener('click', function (event) {
    const btn = event.target.closest('[data-mark]')
    if (btn) cycleMark(btn.dataset.mark)
  })
  $('#accuse-form').addEventListener('submit', accuse)
  $('#start-btn').addEventListener('click', startGame)
  $('#story-btn').addEventListener('click', function () {
    setOverlay('intro', true)
  })
  $('#close-win-btn').addEventListener('click', function () {
    setOverlay('win', false)
  })
  $('#hint-btn').addEventListener('click', showHint)
  $('#reset-btn').addEventListener('click', resetGame)

  if (state.started) {
    setOverlay('intro', false)
    startTimer()
  } else {
    setOverlay('intro', true)
  }
}

init()
