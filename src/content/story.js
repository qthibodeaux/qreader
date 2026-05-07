const placeholderChapter = (chapter) => {
  const day = String(chapter).padStart(2, '0');

  return {
    chapter,
    date: `2026-05-${day}`,
    title: chapter === 17 ? 'Birthday Queen Day' : `Chapter ${chapter}: Page ${chapter}`,
    body: [
      `This is placeholder text for chapter ${chapter} of Bae's Anatomy.`,
      'Replace this with the real story entry when it is ready. Each chapter unlocks on the same day as its matching scrapbook page.',
      'Keep chapters short enough to feel good on a phone, like a page from a tiny book made just for Jessica.',
    ],
  };
};

const splitChapterBody = (text) => text.trim().split(/\n\n+/);

const chapter5Body = splitChapterBody(`
The ferry pulls away from Hillpoint with a low groan that sounds like an old deacon clearing his throat before testimony service. The river carries us slow at first, then steady, rocking the boat just enough to remind everybody aboard that man may build a vessel, but the water still has the final say.

Christopher sits across from me with his pack between his knees, but his eyes are not on me, the river, or the morning light breaking over the water. His attention is trapped by a boy two benches down playing with a palm-sized gray box that flickers with tiny blue illusions. Little soldiers marching. A train running through a mountain. A bird folding itself into smoke.

Christopher's mouth is slightly open.

I know that look. It is the same look he had when Jon brought home our first kitchen spark-stove and Christopher took it apart before I had cooked a single egg on it.

"Christopher."

No response.

"Christopher Michel."

His eyes snap to me. "Yes, ma'am?"

"What did I just say?"

He blinks hard, as if the answer might appear on the inside of his eyelids. "You said...we need supplies."

"That is what I said before what I just said."

He looks toward the gray box again.

I tap his pack with my foot. "Eyes here."

He drags his gaze back to me, but it comes protesting the whole way.

"We are going into Armand's Bayou. We are getting balm jars, sterile thread, two boxes of clean wraps if they have them, and a new pressure gauge if the cost does not make me rebuke the store owner in public."

"Yes, ma'am."

"And after that?"

He hesitates.

I raise an eyebrow.

"Light of the World Church," he says.

"Good. And why are we going there?"

"To see Miss Silvie."

"Mother Silvie," I correct him.

He gives me a look that belongs to the space between boy and man. Too old to be told every little thing. Too young to stop needing it.

"Yes, ma'am. Mother Silvie."

"And?"

He sighs. "And to not embarrass you."

"That was not on the list, but I do appreciate it."

He smiles, then tries to hide it by looking out over the river. The Rosa is redder out here, thick with mountain sediment carried from lands neither of us have seen. The red water glides toward the gulf where it meets the blue, and by the time it wraps around Armand's Bayou, the whole world starts to look purple in the right light.

The city rises before us like something God allowed man to imagine after a long nap and a good meal. Cypress trees taller than church steeples grow from the swamp, their roots twisting through clay platforms and walkways, their branches holding homes, shops, balconies, lanterns, and prayer ribbons. Bridges stretch from trunk to trunk. Boats slide underneath. Children run above us across wooden paths like squirrels with errands.

Christopher leans over the side of the ferry.

"Sit back before you become a news item," I say.

He sits back, but his eyes are shining.

"This place is something else," he says.

"It is."

"I mean, Hillpoint is nice, but this is..."

He stops himself.

"This is what?" I ask.

He shrugs. "Just bigger."

I let that sit between us.

The ferry docks with a bump, and the crowd spills into the bayou streets. Armand's Bayou smells like river water, fresh clay, sweet bread, fish grease, wet wood, and somebody's perfume trying too hard. Christopher walks beside me, but every few steps I lose him to some new distraction.

A man selling illusion cards.

A woman with a mechanical parasol that opens and closes like a flower.

A boy riding a wheel-board that hums two inches above the ground.

A storefront with moving letters in the window.

"Christopher."

"I'm coming."

"You are standing still."

He jogs to catch up.

We make it through the market with only three near separations, one unnecessary conversation with a device salesman, and one long stare from Christopher at a display of pocket echophones.

"You know," he says, "if we had one of those at Restoration Care, Nathaniel would not have to yell across the building."

"Nathaniel does not have to yell across the building now."

"But he does."

"That is because your brother believes every thought deserves a full announcement."

Christopher laughs. "True."

"And we do not need another noise-making box in that facility."

"But this one could be useful."

I look at him. "Everything is useful to someone trying to sell it."

He does not argue, but I see the words collecting behind his teeth.

That is Christopher. His mind is always chasing three rabbits at once, then wondering why he has not caught dinner.

By the time we reach Light of the World Church, the city noise begins to fall behind us. The church stands at the mouth of the bayou where the river widens toward the gulf. It is built into the base of an ancient cypress, with white stone wrapped around the trunk and stained glass set between the roots. Above it, a lighthouse tower climbs through the branches, its great lamp resting high enough to touch the low clouds.

At night, they say the light can be seen from miles out in the gulf. Bringing boats home. Bringing souls to shore. Bringing sinners close enough to decide whether they want saving.

The sign at the front reads:

THE LIGHT OF THE WORLD CHURCH
A CITY SET ON A HILL CANNOT BE HID

I smile despite myself.

"That from Matthew?" Christopher asks.

I turn to him, surprised. "Look at you."

He shrugs. "I listen sometimes."

"Sometimes is carrying a mighty load in that sentence."

He grins.

Inside, the church is full of movement. Women are hanging blue and white cloth for Blue Dusk. Men are carrying benches. Children are running errands they half understand. Somewhere in the sanctuary, the choir is rehearsing, and one alto is fighting for her life against a note the Lord did not assign her.

A young man in a linen vest approaches us with a smile too smooth to be trusted.

"Christopher Michel?"

Christopher straightens. "Yes."

"I'm Brother Elias. Youth ministry." He shakes Christopher's hand with both of his. "We're starting the Saul's Donkey hunt in a few minutes. Your mother said you might join us."

Christopher looks at me like I have sold him at auction.

I smile. "Did I forget to mention that?"

"Yes."

"Hm. Must have slipped."

Brother Elias laughs. "It's simple. We hid little carved donkeys throughout the church grounds. Each one has a clue tied to the story of Saul. First team to find seven wins."

Christopher looks toward a group of city kids already gathered near the courtyard. They are dressed in clean blues and pressed whites, all bright shoes and sharper edges. One boy has a little silver device clipped to his sleeve. Another girl has blue beads braided into a pattern so neat it looks engineered.

Christopher looks down at his own boots, still carrying Hillpoint dust.

"I can just wait with you," he says.

"No, you cannot."

"Mama."

"Christopher."

Brother Elias gives him another smile. "You'll be fine. We mixed the teams."

That somehow makes Christopher look worse.

I lower my voice. "Go on. Chase a donkey. Maybe you will find some sense while you are out there."

He gives me a wounded look.

I touch his cheek before he can fully pull away. "Go."

He goes, though every step declares betrayal.

I watch him join the others, then make my way through the side hall toward Mother Silvie's office.

Silvie does not stand when I enter. She does not need to. Some women carry authority sitting down.

She is at her desk, silver hair wrapped high, Bible open to one side, ledger open to the other, spectacles low on her nose. Her skin is the color of deep pecan, her hands folded as if she has just finished praying over something that had the good sense to listen.

"Michel'le," she says.

"Mother Silvie."

"Come here, baby."

I do.

She takes my hands, and the room settles. That is what being around strong grace feels like. Not lightning. Not thunder. Not performance. More like cool water after fever.

"You tired," she says.

"I am working."

"That was not what I said."

I sit in the chair across from her.

Silvie studies me with the patience of someone who has already heard the answer and is waiting on me to stop decorating it.

"I had a hard case," I say. "Carriage accident. Internal bleeding. Broken leg."

"Did he live?"

"Yes."

"Then praise God."

"Praise God," I say.

"But?"

I look away.

She waits.

"My grace did not feel right."

Silvie's eyes soften but do not pity me. I appreciate that. I have no use for pity unless it comes with supplies and a clean operating room.

"It came," I say. "But it was slippery. Thin. I had to dig for it."

"You been digging a lot lately?"

"I have been serving."

"That is not what I asked."

I exhale.

Outside her window, the youth group shouts as the hunt begins.

Silvie closes her Bible gently. "Michel'le, the Lord gives grace. We do not mine it out of ourselves like coal."

"I know that."

"Do you?"

I sit back.

She reaches for the Bible, turns a page, and taps it once.

"My grace is sufficient for thee," she says. "For my strength is made perfect in weakness."

"Second Corinthians," I say.

"Do not quote it like a student. Receive it like a daughter."

That shuts me up.

Silvie's voice gentles. "You cannot serve the whole village, raise two boys, manage a husband, fight every new machine, prove every point, and then act surprised when your spirit is tired."

"I am not trying to prove every point."

She gives me a look.

"I am proving some points," I admit.

"There it is."

I rub my forehead. "Blue Hill Medical is moving in fast. Bayou Medical Technologies came to my door. They brought spectacles that can see bone through skin."

Silvie's eyebrows rise slightly. "Ray Marrow?"

"You know them?"

"I know of them."

"You approve?"

"I approve of anything that helps the suffering without stealing the soul of the work."

"That sounds like a yes and a no."

"Most truth does."

I do not like that answer. Mostly because it sounds like something I would say to someone else.

Silvie leans forward. "Technology is a tool. Pride is the danger. Fear too."

"I am not afraid."

She tilts her head.

"I am concerned," I correct.

"That is fear with church shoes on."

I almost laugh, but it catches in my chest.

From the courtyard comes a burst of laughter. I glance out the window and see Christopher spinning in place with a clue card in his hand while two boys point in opposite directions. One of the city boys says something, and the group laughs again.

My jaw tightens.

Silvie follows my gaze. "He is your scattered one?"

"He is my Christopher."

"That is not a no."

"He is smart. Curious. But everything catches his eye. He wants every gadget, every gray box, every new thing that hums, clicks, shines, or talks back."

"And that troubles you."

"It distracts him."

"Maybe. Or maybe the Lord gave that boy eyes for what is coming."

I look at her.

She smiles. "Not every calling looks still at first."

Outside, the hunt ends with a cheer from the far side of the courtyard. Christopher's team does not win. I can tell before anyone says it. His shoulders have fallen, and his face has gone tight in that way boys use when they are trying not to look hurt.

By the time I leave Silvie's office, Christopher is sitting alone on a low wall near the lighthouse base, scraping mud off his boot with a stick.

I sit beside him.

He does not look at me.

"You find any donkeys?"

"One."

"That is one more than I found today."

He flicks the stick into the grass.

"They laughed at me."

"I saw."

"They said Hillpoint boys must be used to chasing livestock."

I feel heat climb up my neck.

"And one of them said I was moving slower than Moses in the wilderness."

I press my lips together.

"That one was almost funny," he says bitterly.

"Did you laugh?"

"No."

"Then it was not funny enough."

He shrugs. "They know all this stuff. They knew where everything was. They knew the clues. They had devices and maps and all kinds of things. I was just standing there looking country."

"You are country."

His head snaps toward me.

I hold up a hand. "And there is nothing wrong with that."

He looks away again. "I do not want to be stuck in Hillpoint forever."

There it is.

The thing he has been carrying under all that distraction.

"I know," I say.

He looks surprised. "You do?"

"A mother knows when a child starts looking past the fence."

"I do not hate Hillpoint."

"I know that too."

"I just..." He swallows. "I want to understand things. How they work. How the city has all this technology and movement and light. I want to know how people make things better. Faster. Easier."

I say nothing.

He picks at a loose thread on his sleeve. "At Restoration Care, everything feels like we are always barely making it. You are tired. Dad is tired. Nathaniel is yelling. I mess stuff up. The supplies are low. Then we come here and everything is moving like the future already got started without us."

The words hit me harder than I expect.

Because he is not wrong.

A bell rings overhead, deep and bright. Boats in the bayou answer with little horns, and for a moment the whole city seems to breathe in rhythm.

I place my hand over his.

"Christopher, Saul went looking for donkeys."

He frowns. "What?"

"Brother Elias did not explain the point?"

"He tried. I was mad."

"Of course." I squeeze his hand. "Saul went looking for his father's lost donkeys, and while he was out there wandering, God was moving him toward something bigger than what he understood."

Christopher stares at the ground.

"Sometimes lost is not lost," I say. "Sometimes it is the road before you know its name."

He does not answer, but his fingers stop worrying the thread.

"You are not wrong for being curious," I continue. "You are not wrong for wanting to see what is beyond Hillpoint. But you cannot let every shining thing pull you away from who you are. Curiosity is a gift when it learns discipline. Without discipline, it is just a dog chasing lantern bugs."

That gets a small laugh.

"There he is," I say.

He leans into me just a little, not enough for anybody passing by to accuse him of being a child, but enough for me to feel the weight of him.

On the ferry back, the sun hangs low and warm over the Rosa. The city fades behind us, purple light catching on the water where red river dreams of blue gulf.

Christopher sits beside me this time. Not across from me. Beside me.

His shoulders are broader than they were last year. His voice has started doing that foolish thing where it cannot decide what floor it wants to live on. There is a young man arriving in him piece by piece, but hurt still sits on him like a little boy with scraped knees.

I want to fix it. That is my first instinct. Patch it. Balm it. Wrap it. Pray over it until it behaves.

But the Lord presses something quieter into me.

Not every ache is asking for mending.

Some are asking for grace.

So I sit with my son while the ferry carries us home. I do not scold him for the donkeys he missed. I do not warn him about the city lights. I do not tell him all the ways the world will try to make him ashamed of where he comes from.

I just let him rest his head against my shoulder when he thinks no one is looking.

And for once, I let that be enough.
`);

const chapter6Body = splitChapterBody(`
Seventhday morning in Hillpoint does not arrive quiet.

It arrives with somebody's rooster lying about the time, Sister Janice warming up her soprano two houses too early, children being threatened into clean shoes, men pretending they know where their ties are, and mothers all across the village speaking in tongues that sound suspiciously like, "If you make me late for church, I will show you judgment before we get to mercy."

In our house, the spirit of delay is working through Christopher.

"Where is your belt?" I ask.

He looks down like he expected it to appear from conviction alone. "I had it."

"That is not a location."

Nathaniel steps from the corner already dressed, shirt tucked, shoes clean, hair brushed with more care than I have seen from him all month. He adjusts his collar, then immediately looks uncomfortable with the fact that he adjusted his collar.

Jon walks in carrying two mismatched socks and a piece of toast.

"Why do you have toast upstairs?" I ask.

"Emergency provision."

"The emergency is you?"

"Usually."

I point at Christopher. "Find a belt."

Christopher disappears.

I point at Jon. "Find dignity."

Jon looks at the toast. "I have provision. Dignity can meet us at church."

Nathaniel tries not to laugh.

I see it, and it softens me more than I want to admit.

He is nervous. My firstborn, standing there with his usher pin in his hand, trying to look like a man ready to serve while his thumb rubs the same edge over and over.

"You ready?" I ask him.

"Yes, ma'am."

That was too fast.

I step closer and straighten the pin on his jacket.

"You do not have to be perfect to hold a door."

"I know."

"You do not have to be smooth to pass out programs."

"I know."

"And if Jasia speaks to you, the Lord has blessed you with more than one word in your mouth."

His eyes go wide. "Mama."

"I am just saying. Use two. Maybe three if the Spirit moves."

Jon laughs into his toast.

Nathaniel mutters, "I should have skipped again."

"No," I say, softer. "You skipped last year because you were afraid of being seen. This year, you are going to stand at the door and help people come in. That is not small."

He looks down.

I touch his cheek. "Courage is not always loud."

For a second, he lets himself hear me.

Then Christopher runs in wearing a belt that belongs to Jon, looped twice and hanging like a question.

"We are leaving," I say.

Hillpoint Baptist sits on a rise overlooking the south fields, white boards, blue shutters, and a bell tower that leans just enough to keep everybody humble. The church is not large, but on Seventhday it feels like the whole village has been poured into it and stirred with a wooden spoon.

The ushers stand at the front doors in blue vests. Nathaniel takes his place beside Deacon Morris, who gives him one firm nod like he is inducting him into military service. Nathaniel nods back too hard.

I watch him open the door for Sister Lakethia and her children.

Jasia walks in wearing pale blue ribbons in her hair.

Nathaniel freezes.

The door begins to close on Brother Paul behind her.

Deacon Morris clears his throat.

Nathaniel jumps, catches the door, and nearly salutes.

Jasia smiles. "Good morning, Nathaniel."

He opens his mouth.

I hold my breath.

"Good morning," he says.

Two words.

I almost shout.

Jon leans near my ear. "Look at God."

"Do not start."

"Two whole words. Revival is near."

I elbow him lightly, but I am smiling.

Inside, the choir is already moving. Claps rise like rain on a tin roof. Sister Janice takes the first line, and the congregation answers. Feet stomp. Fans wave. Somebody's baby begins crying and is immediately out-sung by the altos. By the second song, half the room is standing.

There is nothing like a small Southern church when praise gets loose. Folks who complained about knee pain in the parking lot suddenly find enough strength to two-step in the aisle. Men who barely speak above a grunt at home start hollering, "Yes, Lord!" like the roof requires their assistance to stay attached.

I sing until my chest opens.

Not all the way. But enough.

The pastor preaches from First Corinthians.

"For as the body is one," he reads, "and hath many members, and all the members of that one body, being many, are one body."

I shift in my seat.

Jon glances at me.

I look forward.

Pastor keeps going, walking the aisle now, Bible in one hand, handkerchief in the other.

"The hand cannot say to the foot, I have no need of thee. The eye cannot say to the hand, I have no need of thee. Some of us are tired because we have been trying to be the whole body by ourselves."

I do not move.

I do not blink.

I do not look at Jon.

The Lord does not have to be loud to be rude.

After service, fellowship spills across the yard. Children chase each other between tables. Men argue about crops and ball scores. Women arrange food while pretending not to run everything. Nathaniel continues ushering near the door, handing out bulletins for the evening Blue Dusk planning meeting. Every now and then, Jasia passes by, and each time he manages one more word than before.

Progress is progress.

I am near the lemonade table when Ernestine appears beside me wearing a yellow hat large enough to shade a small nation.

"Michel'le," she says.

"Ernestine."

She smiles. "Gerald been home every evening this week."

"Has he?"

"Mmhmm. Sitting on the porch. Asking if I need anything. Said his stomach been feeling much better."

"I told him to make some lifestyle changes."

She gives me a look over her fan. "I am sure you did."

"I also told him to lay off cholesterol."

"And?"

"And the ladies around town."

Ernestine's smile grows slow and dangerous. "That was mighty Christian of you."

"I try to serve."

She pats my hand. "I sent a jar of peach preserves to Restoration Care."

"That was not necessary."

"I know."

She winks and walks off.

Jon appears instantly. "Did I hear peach preserves?"

"No."

"I felt preserves in the atmosphere."

"You feel too much."

"I am Favored in preserves."

"You are favored in foolishness."

Before he can respond, the air changes.

It is subtle at first. A hush traveling under the noise. Heads turning toward the road. Conversations folding in on themselves.

A polished carriage rolls up to the churchyard.

Not Hillpoint polished. City polished. Black lacquer. Silver trim. Blue Hill Medical's mark painted on the side in crisp white letters.

The driver steps down first. Then two assistants in clean blue coats. Then Lady Benoit.

I have not seen her in years.

Back then, she was Sister Benoit, a Favored woman with strong hands and a stronger voice, one of the missionaries who could pray over a fever until the whole room cooled. She had grace. Not like Silvie, no. Few had grace like Silvie. But enough to matter. Enough to serve.

Now she steps into the churchyard wearing a tailored blue dress, pearl gloves, and a hat that looks expensive enough to require its own tithe.

People move toward her before they understand why.

She smiles like she forgives them for staring.

"Saints of Hillpoint," she says, voice carrying clear without an echophone. "What a blessing to stand among believers."

Pastor approaches carefully. "Lady Benoit. We were not expecting you."

"No one expects provision until it arrives."

Jon mutters, "Somebody should have left provision in the carriage."

I shoot him a look.

Lady Benoit's eyes find me.

"Michel'le."

"Sister Benoit."

A small flicker crosses her face.

"Lady Benoit now."

"So I heard."

The yard tightens around us.

She turns to the others. "I come with good news. Blue Hill Medical is opening its doors wider to the surrounding villages. We have treatments, tools, casts, lung pumps, sterile rooms, and trained staff prepared to serve what old methods cannot always reach."

Old methods.

I feel the phrase land on me.

She continues, smooth as butter left too near the stove. "The Lord gave Noah measurements. He gave Moses a staff. He gave David a sling. We must not pretend holiness only comes through what is familiar."

A few people murmur.

That is the danger of her. She knows the language.

Pastor says, "We thank God for all help that truly helps."

"As do I." Lady Benoit turns again toward me. "I especially thank Him for the Chioma who have served faithfully. But no servant should become a bottleneck to mercy."

The word strikes harder than I expect.

Bottleneck.

Not healer. Not servant. Not neighbor.

Obstacle.

I lift my chin. "A tool can serve the work. It cannot replace the calling."

"Perhaps." Her smile sharpens. "But a calling that refuses tools may become pride dressed as faith."

The churchyard goes quiet.

I hear Nathaniel somewhere behind me. I do not turn. I can feel his worry like a hand at my back.

Then the carriage door opens again.

Treyveon steps out slowly, one hand braced against the side. Celeste follows, face tight with embarrassment and hope. Treyveon's leg is wrapped in a temporary brace from our clinic. My brace. My limited supplies. My best attempt with what we had.

He is alive because of me.

No.

He is alive because of God.

I correct myself, but the first thought has already exposed me.

Lady Benoit gestures toward him. "Brother Treyveon is grateful to be living. We all are. But he remains in pain. Unable to work. Unable to walk properly. His healing is incomplete."

Celeste will not meet my eyes.

I cannot blame her.

I do anyway.

Lady Benoit looks at me. "Can you mend the leg fully, Chioma?"

The title sounds different in her mouth. Like a challenge, not honor.

I step toward Treyveon. The crowd shifts. My hands feel cold.

I know bones. I know flesh. I know blood. I know the quiet language of pain under skin. I also know my limits.

Internal rupture? Yes, if the Lord grants and my grace holds.

Clean closure? Yes.

Stabilizing shock? Sometimes.

Rebuilding a badly fractured leg whole and straight days after trauma?

No.

Not me.

Not like Silvie might.

Not like the stories say the great ones did.

I reach for grace anyway.

For a moment, I feel it. Thin. Strained. Like thread pulled too tight.

My frustration rises, and with it, the grace pulls farther away.

Not now, I think.

Not in front of them.

Not in front of her.

Treyveon winces as I touch the brace.

I remove my hand.

"No," I say.

A sound passes through the crowd.

I keep my voice steady. "Not fully. Not safely. Not with the tools I have."

Lady Benoit nods as if I have just confirmed a diagnosis.

"No shame in limits," she says. "Only in denying people relief because of them."

She motions to her assistants.

They bring out a slim case. Inside is a folded white cast lined with small brass joints and blue-threaded stitching. Fast-cast. I have heard the name, but seeing it up close makes my stomach tighten.

They wrap it around Treyveon's leg. One assistant turns a small dial. The cast stiffens with a soft hiss, shaping itself from thigh to ankle. Blue light runs along the seams.

Treyveon gasps.

Celeste grabs his hand. "Trey?"

He steps once.

Then again.

His face opens.

"It don't hurt," he says.

The yard erupts.

Not fully. Not everyone. But enough.

A miracle does not have to be holy to make people shout.

Celeste cries and hugs him. Treyveon laughs, shaky and relieved. Sister Lakethia covers her mouth. Deacon Morris says, "Well, now," in a way that could mean anything from praise God to call a meeting.

Lady Benoit looks at me through all of it.

I feel something in me fold.

Not break.

Fold.

Like a letter being put away before it is finished.

Later that night, I sit at the kitchen table with the Bible open between me and Jon.

The house is quiet. The boys are upstairs, though Christopher is probably awake staring at something he should not be staring at, and Nathaniel is probably replaying every word he said to Jasia like it is court evidence.

Jon sits across from me with his sleeves rolled, turning pages too slowly.

"It is in there," I say.

"I believe you."

"No, you do not."

"I believe many things are in here. It is a large book."

I point at him. "Do not play with me."

"I am not playing. I am searching for the verse that says, 'And lo, technology is tacky and Lady Benoit is wrong.'"

I narrow my eyes.

He flips another page. "Might be in Habakkuk."

"It is not in Habakkuk."

"Then why we never read Habakkuk? Suspicious."

"Jon."

He closes the Bible gently.

"I could not find it."

"You barely looked."

"I looked with my whole spirit."

"You looked with one eye and half a snack."

He leans back. "I did find several verses about pride, patience, many members of one body, and not leaning on your own understanding."

I stare at him.

He smiles carefully. "But nothing about Michel'le always being right."

I push back from the table. "Get out."

"This is my kitchen."

"Get out of my side of the kitchen."

He stands, hands raised. "I love you."

"I love you outside this room."

He comes around the table and kisses the top of my head before I can stop him. "You saved that man's life."

I say nothing.

"He wanted to walk too," Jon says.

Still, I say nothing.

"That does not erase what you did."

My throat tightens, and I hate that too.

Jon leaves me there because he knows when to stop. Most times. Eventually.

I sit with the open Bible, the cooling lamp, and the ache of a week that has asked too much.

My grace did not answer when I wanted it to. My hands could not do what the fast-cast did. My heart could not rejoice cleanly for a man walking without pain because part of me felt replaced.

That is an ugly thing to admit.

But the Lord sees ugly things before we confess them.

Outside, Hillpoint settles into night. Somewhere down the road, somebody laughs. Somewhere upstairs, one of my sons drops something and whispers a prayer too late. Jon hums off-key in the next room like peace is something he can annoy back into the house.

I look down at my hands.

Hands that heal.

Hands that clench.

Hands that serve.

Hands that still have not learned how to let go.

I breathe.

Not enough to fix anything.

Just enough to stay.
`);

export const storyChapters = [
  {
    chapter: 1,
    date: '2026-05-01',
    title: 'Chapter 1: The Calm Within the Storm',
    body: [
      'Panic is in the air. Celeste is sobbing louder as precious seconds are going by. Nathaniel is saying all the wrong words trying to calm Celeste down. Christopher is looking aimlessly around trying to find the forceps that are evading him even though they are right in front of his face. And Jon, ummm, he thinks he is here just for his handsome looks. My resolve is unshaken as I silently mouth the process. "Breathe. Assess. Pressure. Inspect. Approximate." It keeps me focused and my mind on the task. I am the calm island in the storm of chaos around me.',
      'Celeste has been crying uncontrollably in the corner since they arrived. She brought her husband in because he was trampled by an out of control carriage. He moved her out the way to keep her from being hit first. The incident has left poor Treyveon with a severely fractured leg and a large open wound on his abdomen. Celeste was able to help the big lug to my care facility a few blocks away. Which is as fortunate as can be in this situation.',
      'Blood JUMPS from the wound and startles Nathaniel, which drives Celeste into an even deeper panic. Jon grabs the tools, hands them to me, and smiles bright...mission accomplished like he is really helping. I continue to mouth the process, I zone in, I lower my heart rate, I center myself and reach to the God given grace within me. The well of grace I normally feel has been slippery lately. It has caused a bit of unease within me. But I cannot worry about that now. This wound cannot wait.',
      'I dig within grasping for my grace, the temperature in the room feels HIGH. I glance at Jon who tries to read my mind. And like magic, he heads to the thermostat. I do not have much time, Treyveon has lost a lot of blood already but I got this. I dig even deeper and feel the strands of my grace. I lend them to Treyveon, slowly closing the rupture that has hit a few internal organs. Celeste\'s mouth falls open but she is silent for the first time and she witnesses the process. The grace was barely enough to get him patched up internally. Steam slowly arises from the wound as Treyveon lets out a small groan of relief.',
      'The bleeding lessens. Jon takes over and begins stitching the skin. Immediate crisis averted. Treyveon will live. Our facility is low on many supplies so we do what we can with patching the flesh and getting his leg in a brace. Celeste and Treyveon will have to venture into town to get the leg fully casted but the hard part is over. They can begin to heal mentally as well as physically. We graciously accept what little credits they have to offer. Times are tough for everyone. The whole village is struggling. Restoration Care is struggling but by His grace...we will find a way.',
      'I walk them to the door and wave as they walk away. The cool evening air feels good and provides a moment of peace and stillness in contrast to the tense and fiery moments before. I enjoy this moment of calm before it is interrupted by the sound of glass shattering. Yup, that sounds about right.',
    ],
  },
  {
    chapter: 2,
    date: '2026-05-02',
    title: 'Chapter 2: Blue Dusk and Broken Vials',
    body: [
      '“WHY DID YOU BUMP INTO ME CHRISTOPHER!?” Nathaniel shouts at Christopher who responds sarcastically “IT’S FIINNNEEEEE“. I turn around and see Nathaniel and Christopher fussing at each other and standing over lab vials.',
      'Ahh the joy of having your two teenage sons help out around the facility. It was cute at first when they were younger. They still had the childlike determination to help and follow instructions. Newfound muscles to lift things and help build a new section of the facility. And then teenage self realization hits and their moods, motivations, and energies changed. They are no longer my babies but soon to be adults ready to leave the nest. It is bittersweet as a mother to see the seeds you planted grow but also it might be time for them to leave and stop ruining my practice!',
      '“Nathaniel clean that up now! Christopher, if you do not have that inventory list to me by the end of the night, you are not going to that Blue Dusk,” I say sternly as they groan in their displeasure. Their shenanigans are becoming too much. We are already low on supplies and we cannot waste what little we have right now.',
      'Everything is low right now. Low on energy, grace, time, credits, and any sign that the rest of the evening will be enjoyable. We have too much going on and not enough of anything. Barring any emergencies, Treyveon is the last patient I have the desire or grace to see tonight. The boys and I tidy up the front. We all had dropped everything as soon as Celeste burst in earlier. They chat about their plans at Blue Dusk. What they will wear and who they will talk to.',
      'I miss going to Blue Dusk. Being young and full of hormones, anxiety, and energy. Choosing which light blue to wear. The awkward exchanges between potential suitors as you would promenade around the plateau. Jumping into the Rosa River with Jon.',
      '“You know I met your dad at Blue Dusk” I say to the boys with a smile. The look of disgust on the boy’s face is a brief moment of joy.',
      '“Speaking of, where is your Dad?” I ask them as I finish organizing Nathaniel’s reception desk. The look of obliviousness on their faces take me right to the edge. Getting teens to care about anything other than immediate self is Samson-esque task. And I do not have the strength in me right now.',
      'I head to the back, the boys brought me to the edge and Jon is here with the final push!',
      '“WAKE UP!” I yell uncontrollably. Jon’s eyes shoot open and he frantically starts moving.',
      '“HOW ARE YOU ASLEEP!?” I blurt out with a mix of confusion and astonishment.',
      '“I wasn’t asleep, I was just making sure the waiting chair was good. Poor Celeste, had made a mess over here.” Jon wakes up like he was not just fast asleep. Our operating room is disorganized and half clean. Jon did a decent job at cleaning up the fluid mess but he is far from getting it back to a reset point.',
      '“I got this! I will finish up down here then I will cook up some poultry and rice. Then we can enjoy the rest of the evening.” He says as he comes over and tries to kiss and hug me. I move away, sweet nothings will not get Restoration Care ready for tomorrow.',
      'Jon resumes organizing the operating room and I begin straightening the chairs where Celeste and Nathaniel were sitting doing the operation. I sit down for a second just to color my thoughts. Jon smirks and lets out a quick chuckle. I shoot him a menacing glance because nothing is funny right now. I take a deep breath to reset. And then another. “BREATHE” I say to myself.',
      'One breath at a time.',
      'One moment at a time.',
      'One step at a time.',
      'I try to assess the situation but I can not focus. I just breathe.',
      'zzzzzzzzzzzzzzzzzzzzzz',
    ],
  },
  {
    chapter: 3,
    date: '2026-05-03',
    title: 'Chapter 3: Ray Marrow Spectacles',
    body: [
      '“Feet.” I stir back to consciousness. “FEET!” Jon says again motioning with the mopper stick.',
      '“I wasn’t sleep.” I say as I lift my feet.',
      '“I don’t blame you. That chair is COMFORTABLE plus it has been a long day.” he smirks as he continues.',
      '“That chair too comfortable. Where we buy that at?” I say as I get up and look around the room. I did not doubt Jon’s cleaning abilities or effort. Just finishing the job is another story. He can be a good husband, sometimes. For the half he does not get done, I am there. And vice versa. I guess we complete each other.',
      '“You are tired! Go upstairs, hygiene, and watch a few illusions. I got supper covered.” He laughs and continues his task.',
      '“I don’t want to watch any illusions tonight.” I grumble as I start to walk off. Meditation and prayer will help me reconnect with my grace. Observing the illusions move in the gray box does not. They are entertaining though.',
      'The rate at which new technologies are appearing is alarming. The salesmen speak of revolution but they provide a mild convenience at best. At worst, they are a money and time sink.',
      'I turn back and look at Jon before leaving the room. He has done a good job resetting the operating room. He does a little shimmy, then looks up and winks as if he can feel me thinking about him. That man cannot wink with one eye. It looks like it pains the other half of his face.',
      '“Side note, I will take Christopher to town tomorrow to get supplies after I finish the Warden’s supply shed. I will use the credits to get everything.” Jon says as he looks through the sparse cabinets.',
      '“No, I will go with him. I am closing early. I need to see Silvie, she wants me to look at a few things. She has to get a few of her girls ready for Blue Dusk. I am headed up.” I respond as I leave the room.',
      'As I go to lock the front door, I see a lady and two gentlemen unloading a carriage with boxes. I make eye contact with the lady who then speeds towards me.',
      '“Chioma Michel’le I presume?” The lady inquires and stares blankly. She is obviously not from the village. We do not refer to those that have been blessed with His grace as Chioma here but it is the formal title. I debate if this person warrants a response at all.',
      'Restoration Care is effectively closed for the evening and strangers at your doorstep at this time is rarely a good thing. Especially when the strangers are as rude as these are. But recent alertness and curiosity have gotten the best of me.',
      '“Speak plainly, clearly, and swiftly. Who are you and what business do you desire with the Chioma of the village?” I entertain with the same tone she provided.',
      '“Mayhaps we started on the wrong foot. I am Delphine of Bayou Medical Technologies. Due to dusk eluding us, Michel’le, I will make this quick.” She grabs a bag from one of the boxes that one of the gentlemen had brought forward.',
      '“The medical practice is changing. The need for you Chioma puts a strain on everyone. There are few of you and many of the ones in need. We have new tools and technologies that are helping with medical care. Allow you to help more people. Make more money and maybe even go beyond this podunk town. These tools can ease the burden on you.” She says as she stares me directly in the eye.',
      '“I offer a gift, a few elixirs and a tool that we offer. The Ray Marrow spectacles. They allow you to see bone through the skin. A brief sample of the technologies that we have coming down the pipeline. Blue Hill Medical up yonder is growing fast. So I KNOW, WE WILL TALK FURTHER at the Blue Dusk gathering. Did this meet your..how did you put it…plainly, clearly, and”',
      '“NOT SWIFT ENOUGH! Good night!” Jon barges in as he steps in front of me and ushers the strangers off the property. I could not shake the feeling that I was having about them. I could not pinpoint it for a variety of reasons, be it fatigue, being low on grace, or hunger.',
      'I head upstairs to our private dwelling above the care facility on the first level. I prepare for the days ahead. I fiddle with the Ray spectacles. These would be convenient. I could have maybe saved some grace when mending Treyveon’s leg earlier using these. Even if I did not have the proper brace or supplies. I ponder the tools and toss them back in the bag.',
      'As soon as I do, I feel Jon’s arms wrap around me. It feels good to be in his embrace. We stand in this moment. Here. Right now. Present. We breathe. Not worried about the uncertainty of tomorrow. But together, me, Jon, and the boys. We will take it head on. Together.',
    ],
  },
  {
    chapter: 4,
    date: '2026-05-04',
    title: 'Chapter 4: The Flyer',
    body: [
      'The next morning is methodical. Prayer, meditation, patients. Checkups and appointments. The business of Restoration Care is enjoyable. We serve God and we serve the community. Hillpoint is a small village not far outside of town. Few end up here on purpose. Even fewer end up staying long term. The families that populate the village have been here for generations. So you know most of the faces around the village. Everyone\'s business would end up in the wind faster than a toddler holding something they should not have.',
      'Like my last few patients that I will see before I close. Old Gerald here is in for an abnormal stomach ache. Word in the wind says he might be running around on his old lady. And his lady Ernestine is handy with potions and brews and knowing a thing or two about putting things in food that may put your stomach in knots. I give him a vial of medicine and tell him to lay off the cholesterol and the ladies around town.',
      'Sister Lakethia is in with her son and daughter. Her son sprained his ankle playing ball. She uses this as an excuse to talk and gossip. Jon comes in as I am tending to the boy. He spends the mornings repairing, building, or whatever odd job that might be needed around town for credits before helping in the practice in the afternoons.',
      'Jon and Nathaniel will head to the hills for whatever the menfolk do up there, while Christopher and I will head to the dock to catch a ferry into town for supplies.',
      'I struggle to apply the balm and wrap Jrue\'s ankle. He and Christopher are glued to the illusion on the opposite wall we are facing. It puts his body in a weird position to tend to him. Sister Lakethia helps twist Jrue in position and mentions that Blue Hill Medical has been putting flyers all over town for their new gizmos and technology that can treat anything from the Low Lung Cough to even fast casting broken limbs. And that even members of our Church were curious about going. I remind her that while I am the only Chioma in the village and cannot tend to everyone, whatever technology and gizmotronics they have could not replace everything that the Favored do. We all have our place in the world. I am not here by mistake. I know and understand my purpose here in Hillpoint.',
      'We talk about the excitement of Blue Dusk for the young people. This will be her daughter\'s first cycle to promenade. Many from the church will have young people that will debut this year. It is all the energy at the church.',
      'I instruct Christopher to get ready as we are about to head out. He is still distracted by the illusion coming from the gray box. I repeat it sternly and he pops up with his head on a swivel confused and lost to the world. Lakethia\'s daughter Jasia has been chatting Nathaniel up at the front this entire time. I can tell when Nathaniel is struggling for words.',
      '"I can\'t wait to see you at Blue, Nathaniel," Jasia says bashfully awaiting Nathaniel to speak. I do not know if he has said a word the entire time.',
      '"Ummm, me and my Dad are building something on the hill," Nathaniel blurts out awkwardly.',
      '"Oh, okay." Jasia responds as she slowly turns to follow her mom and brother out of the building.',
      'Jon shakes his head and puts his arm around Nathaniel\'s shoulder as they head to the back. Christopher returns with his pack ready to go. I grab my pack and we head out. We walk through the village waving and greeting neighbors as we make our way to the dock.',
      'The dock market has a bustle to it that the rest of the village does not have. The river that curves and twists through Hillpoint splits it into two distinct areas. The farmlands to the south and the steep hills on the north. The dock, market, and causeway serve as The Nexus. The connection and heartbeat of the village.',
      'We make our way to the ferry and get in queue. Kids play in the vicinity, teens and their PDA, the adults move and work about. A child with an echophone is yelling and promoting the news. He blares out about the ball game scores, a scandal with the Constable, Blue Dusk, the Hillpoint Fair, and other things.',
      'A gentleman comes rushing along passing out flyers to everyone in line. "TAKE THIS, TAKE THIS!" he says as he stuffs a flyer into everyone\'s hand. I walk onto the ferry and the horn sounds. The ferry slowly departs. I look around and everyone is in a commotion over the flyer. The flyer states: COME TO BLUE HILL MEDICAL! THE FUTURE OF MEDICINE IS HERE TODAY! I look up and the gentleman is staring and smiling directly at me.',
    ],
  },
  {
    chapter: 5,
    title: "Chapter 5: Saul's Donkey",
    body: chapter5Body,
  },
  {
    chapter: 6,
    title: 'Chapter 6: The Body Has Many Members',
    body: chapter6Body,
  },
  ...Array.from({ length: 11 }, (_, index) => placeholderChapter(index + 7)),
];
