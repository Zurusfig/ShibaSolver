-- ===========================================================================
-- Demo seed data for ShibaSolver.
--
-- Safe to re-run: every insert is guarded by ON CONFLICT / NOT EXISTS on a
-- unique key, so running it twice does not duplicate rows.
--
-- Leaves real (Google-authenticated) accounts untouched -- seed users are
-- identified by a 'seed-' prefix on google_account and @example.com emails.
--
--   psql "$DATABASE_URL" -f backend/SQL_command/seed.sql
--
-- profile_picture and post_image are left NULL on purpose: the frontend
-- falls back to the bundled /image/DefaultAvatar.png, so the seed needs no
-- external image host and renders the same locally and on Vercel.
-- ===========================================================================

-- === Users =================================================================
INSERT INTO users (google_account, email, user_name, display_name, education_level, bio, interested_subjects, "like", "dislike", created_at)
VALUES
  ('seed-100000000000000000001','emma.walsh@example.com','emmaw','Emma Walsh','Undergraduate - Year 2',
   'CS student. Currently losing to dynamic programming.', ARRAY['Algorithms','Python','Discrete Math'], 42, 3, now() - interval '95 days'),
  ('seed-100000000000000000002','jack.preston@example.com','jackp','Jack Preston','Undergraduate - Year 3',
   'Electrical engineering. I like signals and strong coffee.', ARRAY['Physics','Linear Algebra','Calculus'], 88, 5, now() - interval '88 days'),
  ('seed-100000000000000000003','sophie.miller@example.com','sophiem','Sophie Miller','Undergraduate - Year 1',
   'First year, asking a lot of questions. Sorry in advance.', ARRAY['Calculus','Organic Chemistry'], 17, 1, now() - interval '61 days'),
  ('seed-100000000000000000004','daniel.reed@example.com','danielr','Daniel Reed','Undergraduate - Year 4',
   'Final year. Databases and backend. Ask me about indexes.', ARRAY['Databases','Algorithms','Statistics'], 134, 2, now() - interval '120 days'),
  ('seed-100000000000000000005','olivia.hayes@example.com','oliviah','Olivia Hayes','Undergraduate - Year 2',
   'Maths major. Proof-based everything.', ARRAY['Linear Algebra','Discrete Math','Statistics'], 76, 0, now() - interval '73 days'),
  ('seed-100000000000000000006','marcus.webb@example.com','marcusw','Marcus Webb','Graduate - Masters',
   'Chemistry TA. I will draw you a mechanism.', ARRAY['Organic Chemistry','Physics'], 109, 4, now() - interval '150 days')
ON CONFLICT (google_account) DO NOTHING;

-- === Tags ==================================================================
INSERT INTO tags (tag_name) VALUES
  ('Algorithms'), ('Data Structures'), ('Calculus'), ('Linear Algebra'),
  ('Organic Chemistry'), ('Physics'), ('Statistics'), ('Databases'),
  ('Python'), ('Discrete Math')
ON CONFLICT (tag_name) DO NOTHING;

-- === Posts =================================================================
INSERT INTO posts (user_id, title, description, is_solved, created_at)
SELECT v.user_id, v.title, v.description, v.is_solved, v.created_at
FROM (VALUES
  ((SELECT user_id FROM users WHERE email='emma.walsh@example.com'),
   'Why does my recursive Fibonacci take forever at n = 45?',
   E'I wrote the textbook recursive version:\n\n    def fib(n):\n        if n <= 1: return n\n        return fib(n-1) + fib(n-2)\n\nfib(30) is instant, fib(40) takes a few seconds, and fib(45) has been running for ten minutes. I understand it is "slow" but I do not understand why the jump is so violent. Is there something about recursion in Python specifically?',
   TRUE, now() - interval '9 days'),

  ((SELECT user_id FROM users WHERE email='sophie.miller@example.com'),
   'Intuition for why the derivative of e^x is itself?',
   E'I can follow the proof using the limit definition and the fact that lim (e^h - 1)/h = 1 as h approaches 0. But that feels circular to me, because that limit is basically the thing I am trying to understand.\n\nIs there a way to see WHY e is special here that does not start by assuming the answer?',
   TRUE, now() - interval '7 days'),

  ((SELECT user_id FROM users WHERE email='daniel.reed@example.com'),
   'When does adding an index actually make a query slower?',
   E'My professor said "indexes are not free" but only explained the write cost. Are there cases where an index makes a SELECT slower, not just the INSERT?\n\nI am using Postgres. I added an index on a boolean column with about 50/50 distribution and the query plan ignored it entirely.',
   TRUE, now() - interval '6 days'),

  ((SELECT user_id FROM users WHERE email='jack.preston@example.com'),
   'Determinant is zero -- what does that actually mean geometrically?',
   E'I know det(A) = 0 means the matrix is singular and has no inverse, and I can compute determinants fine. But I have no picture in my head for it.\n\nWhat is geometrically happening to space when the determinant hits zero?',
   FALSE, now() - interval '5 days'),

  ((SELECT user_id FROM users WHERE email='marcus.webb@example.com'),
   'SN1 vs SN2: how do I decide quickly on an exam?',
   E'I keep second-guessing myself under time pressure. I know the textbook factors (substrate, nucleophile, solvent, leaving group) but when I see an actual problem I freeze.\n\nDoes anyone have a decision order they run through mentally?',
   FALSE, now() - interval '4 days'),

  ((SELECT user_id FROM users WHERE email='olivia.hayes@example.com'),
   'Is proof by contradiction ever the WRONG choice?',
   E'I have noticed my professor sometimes marks a contradiction proof as correct but writes "direct proof is cleaner" next to it. If both are valid, why does it matter stylistically?',
   FALSE, now() - interval '3 days'),

  ((SELECT user_id FROM users WHERE email='emma.walsh@example.com'),
   'What is the actual difference between a list and a tuple in Python?',
   E'Everyone says "tuples are immutable" and stops there. But WHY would I ever want something I cannot change? What is the practical reason to reach for a tuple?',
   TRUE, now() - interval '2 days'),

  ((SELECT user_id FROM users WHERE email='jack.preston@example.com'),
   'Why do we normalize by n-1 instead of n for sample variance?',
   E'Bessel''s correction. I can state it, I cannot explain it. Every source I read says "because it is unbiased" and then shows algebra I can follow but do not feel.\n\nWhat is actually being corrected for?',
   FALSE, now() - interval '30 hours'),

  ((SELECT user_id FROM users WHERE email='sophie.miller@example.com'),
   'Big-O of nested loops when the inner bound depends on the outer',
   E'For this:\n\n    for i in range(n):\n        for j in range(i):\n            do_work()\n\nI want to say O(n^2) but the inner loop is not n every time, it grows. Is it still n^2 or is it something like n^2/2, and does the constant matter?',
   TRUE, now() - interval '8 hours')
) AS v(user_id, title, description, is_solved, created_at)
WHERE NOT EXISTS (SELECT 1 FROM posts p WHERE p.title = v.title);

-- === Post tags =============================================================
INSERT INTO post_tags (post_id, tag_id)
SELECT p.post_id, t.tag_id
FROM (VALUES
  ('Why does my recursive Fibonacci take forever at n = 45?', 'Algorithms'),
  ('Why does my recursive Fibonacci take forever at n = 45?', 'Python'),
  ('Intuition for why the derivative of e^x is itself?', 'Calculus'),
  ('When does adding an index actually make a query slower?', 'Databases'),
  ('Determinant is zero -- what does that actually mean geometrically?', 'Linear Algebra'),
  ('SN1 vs SN2: how do I decide quickly on an exam?', 'Organic Chemistry'),
  ('Is proof by contradiction ever the WRONG choice?', 'Discrete Math'),
  ('What is the actual difference between a list and a tuple in Python?', 'Python'),
  ('What is the actual difference between a list and a tuple in Python?', 'Data Structures'),
  ('Why do we normalize by n-1 instead of n for sample variance?', 'Statistics'),
  ('Big-O of nested loops when the inner bound depends on the outer', 'Algorithms'),
  ('Big-O of nested loops when the inner bound depends on the outer', 'Discrete Math')
) AS v(title, tag_name)
JOIN posts p ON p.title = v.title
JOIN tags  t ON t.tag_name = v.tag_name
ON CONFLICT (post_id, tag_id) DO NOTHING;

-- === Comments (top level) ==================================================
INSERT INTO comments (user_id, post_id, text, is_solution, created_at)
SELECT u.user_id, p.post_id, v.text, v.is_solution, v.created_at
FROM (VALUES
  ('Why does my recursive Fibonacci take forever at n = 45?',
   'daniel.reed@example.com',
   E'It is not Python, it is the shape of the recursion. Each call spawns two more, so the call tree has roughly 2^n nodes -- you are recomputing fib(10) millions of times.\n\nGoing 40 -> 45 multiplies the work by about 2^5 = 32x. That is your "violent jump".\n\nMemoize it and it becomes linear:\n\n    from functools import cache\n\n    @cache\n    def fib(n):\n        if n <= 1: return n\n        return fib(n-1) + fib(n-2)',
   TRUE, now() - interval '8 days 20 hours'),

  ('Why does my recursive Fibonacci take forever at n = 45?',
   'olivia.hayes@example.com',
   'Worth adding: the exact base is phi (about 1.618), not 2, since the tree is lopsided. So it is O(phi^n). Still exponential, just slightly less catastrophic than 2^n.',
   FALSE, now() - interval '8 days 4 hours'),

  ('Intuition for why the derivative of e^x is itself?',
   'olivia.hayes@example.com',
   E'Try it backwards. Do not start from e. Ask: is there a function that is its own derivative?\n\nIf f'' = f and f(0) = 1, then the slope at every point equals the height at that point. Build that curve step by step and you get exactly one shape. Then DEFINE e as the value that curve reaches at x = 1.\n\ne is not a magic constant that happens to have this property -- the property came first, and e is the number that falls out of it.',
   TRUE, now() - interval '6 days 18 hours'),

  ('When does adding an index actually make a query slower?',
   'emma.walsh@example.com',
   E'Your boolean case is the classic one. If a value matches ~50% of rows, the planner knows it would bounce between the index and the heap for half the table -- random I/O -- when it could just read the table straight through. Sequential wins.\n\nIndexes pay off when they are *selective*. Rule of thumb: under ~5-10% of rows returned.\n\nIf you mostly query WHERE is_active = true and true is rare, a partial index is the fix:\n\n    CREATE INDEX ON widgets (created_at) WHERE is_active;',
   TRUE, now() - interval '5 days 12 hours'),

  ('Determinant is zero -- what does that actually mean geometrically?',
   'olivia.hayes@example.com',
   E'The determinant is the factor by which the transformation scales area (2D) or volume (3D).\n\ndet = 2 doubles areas. det = 0 means area gets crushed to nothing -- the whole plane collapses onto a line or a single point.\n\nThat is exactly why there is no inverse: once everything on a line has been squashed to one point, nothing can tell you which point it came from. Information is destroyed.\n\nAlso: negative determinant means orientation flipped, like turning the space inside out.',
   FALSE, now() - interval '4 days 20 hours'),

  ('SN1 vs SN2: how do I decide quickly on an exam?',
   'marcus.webb@example.com',
   E'Look at the substrate first. It settles most problems before you read the rest.\n\n  - Methyl or primary -> SN2. A carbocation there is too unstable to form.\n  - Tertiary -> SN1. Too crowded for backside attack.\n  - Secondary -> now you actually have to think. Check nucleophile and solvent.\n\nFor that middle case: strong/charged nucleophile plus polar aprotic (DMSO, acetone) pushes SN2. Weak nucleophile plus polar protic (water, alcohol) pushes SN1.\n\nSubstrate first, every time. It is one glance and it resolves maybe 70% of exam questions.',
   FALSE, now() - interval '3 days 16 hours'),

  ('Is proof by contradiction ever the WRONG choice?',
   'daniel.reed@example.com',
   E'Not wrong, but often weaker. A direct proof usually shows you *why* something is true; a contradiction proof only shows that the alternative breaks.\n\nThe common student error is assuming not-P, deriving P directly, and calling it a contradiction -- at which point you had a direct proof and wrapped it in unnecessary packaging. Your professor is probably spotting that.\n\nContradiction genuinely earns its keep for irrationality, infinitude of primes, and most uncountability arguments.',
   FALSE, now() - interval '2 days 22 hours'),

  ('What is the actual difference between a list and a tuple in Python?',
   'daniel.reed@example.com',
   E'Immutability is the mechanism, not the point. The point is that it makes tuples *hashable*, so they can be dict keys:\n\n    grid = {(0, 0): "start", (3, 4): "goal"}\n\nA list cannot do that -- if it mutated after being used as a key, the dict would lose track of it.\n\nThere is also a signalling value. A list says "a sequence of similar things, probably variable length". A tuple says "a fixed record where position has meaning", like (x, y) or (host, port).',
   TRUE, now() - interval '44 hours'),

  ('Why do we normalize by n-1 instead of n for sample variance?',
   'daniel.reed@example.com',
   E'You are measuring spread around the *sample* mean, not the true mean -- and the sample mean sits, by construction, at the exact centre of your own data. It is the point that minimises squared distance to your sample.\n\nSo your deviations come out slightly too small, always. Not sometimes -- systematically.\n\nDividing by n-1 inflates the estimate to compensate. The "lost" degree of freedom is the one you spent estimating the mean.',
   FALSE, now() - interval '22 hours'),

  ('Big-O of nested loops when the inner bound depends on the outer',
   'olivia.hayes@example.com',
   E'Count the actual iterations: 0 + 1 + 2 + ... + (n-1) = n(n-1)/2.\n\nSo it is about n^2/2, and you are right to notice it is half. But Big-O drops constant factors, so it is still O(n^2).\n\nThe constant is not meaningless -- it means this runs roughly twice as fast as a full n-by-n loop -- but it does not change the growth *class*, and Big-O only describes the class.',
   TRUE, now() - interval '6 hours')
) AS v(post_title, email, text, is_solution, created_at)
JOIN posts p ON p.title = v.post_title
JOIN users u ON u.email = v.email
WHERE NOT EXISTS (
  SELECT 1 FROM comments c WHERE c.post_id = p.post_id AND c.text = v.text
);

-- === Replies (nested comments) =============================================
INSERT INTO comments (user_id, post_id, parent_comment, text, created_at)
SELECT u.user_id, parent.post_id, parent.comment_id, v.text, v.created_at
FROM (VALUES
  ('It is not Python, it is the shape of the recursion.', 'emma.walsh@example.com',
   'The @cache decorator dropped it to instant. I did not realise the recomputation was that severe -- thank you.',
   now() - interval '8 days 15 hours'),
  ('Your boolean case is the classic one.', 'daniel.reed@example.com',
   'Partial index was exactly it. Planner picks it up now and the scan is gone. Did not know that syntax existed.',
   now() - interval '5 days 2 hours'),
  ('The determinant is the factor by which the transformation scales area', 'jack.preston@example.com',
   'The "information is destroyed" framing is what made it land. I had memorised singular = no inverse without ever connecting the two.',
   now() - interval '4 days 6 hours'),
  ('Look at the substrate first.', 'sophie.miller@example.com',
   'Substrate first is such a simple heuristic and somehow nobody said it that plainly in lecture. Saving this before Thursday.',
   now() - interval '3 days 2 hours'),
  ('You are measuring spread around the *sample* mean', 'olivia.hayes@example.com',
   'The point about the sample mean sitting at the centre of your own data by construction is the bit every textbook skips. That is the whole intuition.',
   now() - interval '14 hours')
) AS v(parent_prefix, email, text, created_at)
JOIN LATERAL (
  SELECT c.comment_id, c.post_id FROM comments c
  WHERE c.text LIKE v.parent_prefix || '%' AND c.parent_comment IS NULL
  LIMIT 1
) AS parent ON TRUE
JOIN users u ON u.email = v.email
WHERE NOT EXISTS (
  SELECT 1 FROM comments c2 WHERE c2.text = v.text
);

-- === Ratings ===============================================================
-- Likes on posts, spread so the feed has visibly different scores.
INSERT INTO ratings (user_id, post_id, rating_type, created_at)
SELECT u.user_id, p.post_id, 'like'::rating_type, p.created_at + interval '3 hours'
FROM posts p
JOIN users u ON u.google_account LIKE 'seed-%' AND u.user_id <> p.user_id
WHERE p.title IN (
  'Why does my recursive Fibonacci take forever at n = 45?',
  'When does adding an index actually make a query slower?',
  'Intuition for why the derivative of e^x is itself?',
  'What is the actual difference between a list and a tuple in Python?'
)
ON CONFLICT DO NOTHING;

INSERT INTO ratings (user_id, post_id, rating_type, created_at)
SELECT u.user_id, p.post_id, 'like'::rating_type, p.created_at + interval '5 hours'
FROM posts p
JOIN users u ON u.email IN ('olivia.hayes@example.com','daniel.reed@example.com','jack.preston@example.com')
             AND u.user_id <> p.user_id
WHERE p.title IN (
  'Determinant is zero -- what does that actually mean geometrically?',
  'SN1 vs SN2: how do I decide quickly on an exam?',
  'Big-O of nested loops when the inner bound depends on the outer',
  'Why do we normalize by n-1 instead of n for sample variance?',
  'Is proof by contradiction ever the WRONG choice?'
)
ON CONFLICT DO NOTHING;

-- Likes on comments -- drives which one the feed shows as top_comment.
INSERT INTO ratings (user_id, comment_id, rating_type, created_at)
SELECT u.user_id, c.comment_id, 'like'::rating_type, c.created_at + interval '2 hours'
FROM comments c
JOIN users u ON u.google_account LIKE 'seed-%' AND u.user_id <> c.user_id
WHERE c.is_solution = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ratings (user_id, comment_id, rating_type, created_at)
SELECT u.user_id, c.comment_id, 'like'::rating_type, c.created_at + interval '4 hours'
FROM comments c
JOIN users u ON u.email IN ('sophie.miller@example.com','jack.preston@example.com')
             AND u.user_id <> c.user_id
WHERE c.parent_comment IS NULL AND c.is_solution = FALSE
ON CONFLICT DO NOTHING;

-- === Bookmarks =============================================================
INSERT INTO bookmarks (user_id, post_id, created_at)
SELECT u.user_id, p.post_id, now() - interval '1 day'
FROM users u
JOIN posts p ON p.title IN (
  'When does adding an index actually make a query slower?',
  'SN1 vs SN2: how do I decide quickly on an exam?'
)
WHERE u.email = 'sophie.miller@example.com'
ON CONFLICT DO NOTHING;

-- === Summary ===============================================================
SELECT
  (SELECT count(*) FROM users    WHERE google_account LIKE 'seed-%') AS seed_users,
  (SELECT count(*) FROM tags)                                        AS tags,
  (SELECT count(*) FROM posts)                                       AS posts,
  (SELECT count(*) FROM comments)                                    AS comments,
  (SELECT count(*) FROM ratings)                                     AS ratings,
  (SELECT count(*) FROM bookmarks)                                   AS bookmarks;
