-- ===========================================================================
-- Clears all user-generated content so seed.sql can restore the demo data.
--
-- Run together with seed.sql (services/demoReset.js does both in one
-- transaction). Accounts, admins and tags are kept; every post, comment,
-- rating, bookmark, notification and report is removed -- including ones
-- made by real accounts.
--
--   psql "$DATABASE_URL" -f backend/SQL_command/reset_demo.sql \
--                        -f backend/SQL_command/seed.sql
-- ===========================================================================

TRUNCATE posts, post_tags, comments, ratings, bookmarks, notifications,
         reports, admin_actions
  RESTART IDENTITY;
