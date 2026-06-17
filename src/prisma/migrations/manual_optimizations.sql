-- ============================================================================
-- 📊 MATERIALIZED VIEWS FOR ANALYTICS
-- ============================================================================

-- Subject Performance: Aggregated analytics per subject
DROP MATERIALIZED VIEW IF EXISTS mv_subject_performance;
CREATE MATERIALIZED VIEW mv_subject_performance AS
SELECT 
  s.id as subject_id,
  s.name as subject_name,
  COUNT(ta.id) as total_attempts,
  AVG(ta.percentage) as avg_percentage,
  COUNT(DISTINCT ta.user_id) as unique_students
FROM subject s
JOIN test t ON t.subject_id = s.id
JOIN test_attempt ta ON ta.test_id = t.id
WHERE ta.status = 'COMPLETED'
GROUP BY s.id, s.name;

CREATE UNIQUE INDEX idx_mv_subject_perf_id ON mv_subject_performance(subject_id);

-- Question Analytics: Correctness and usage stats per question version
DROP MATERIALIZED VIEW IF EXISTS mv_question_analytics;
CREATE MATERIALIZED VIEW mv_question_analytics AS
SELECT 
  qv.id as question_version_id,
  qv.question_id,
  COUNT(aa.id) as times_answered,
  AVG(CASE WHEN aa.is_correct = true THEN 1.0 ELSE 0.0 END) as correctness_rate,
  AVG(aa.points_awarded) as avg_points
FROM question_version qv
LEFT JOIN attempt_answer aa ON aa.question_version_id = qv.id
GROUP BY qv.id;

CREATE UNIQUE INDEX idx_mv_question_analytics_id ON mv_question_analytics(question_version_id);


-- ============================================================================
-- 🛡️ DATABASE-LEVEL CHECK CONSTRAINTS
-- ============================================================================

-- User Stats constraints
ALTER TABLE user_stats DROP CONSTRAINT IF EXISTS tokens_non_negative;
ALTER TABLE user_stats ADD CONSTRAINT tokens_non_negative CHECK (tokens >= 0);

ALTER TABLE user_stats DROP CONSTRAINT IF EXISTS xp_non_negative;
ALTER TABLE user_stats ADD CONSTRAINT xp_non_negative CHECK (xp >= 0);

ALTER TABLE user_stats DROP CONSTRAINT IF EXISTS level_positive;
ALTER TABLE user_stats ADD CONSTRAINT level_positive CHECK (level >= 1);

-- Test Version constraints
ALTER TABLE test_version DROP CONSTRAINT IF EXISTS passing_percentage_range;
ALTER TABLE test_version ADD CONSTRAINT passing_percentage_range CHECK (passing_percentage BETWEEN 0 AND 100);

ALTER TABLE test_version DROP CONSTRAINT IF EXISTS duration_positive;
ALTER TABLE test_version ADD CONSTRAINT duration_positive CHECK (duration > 0 OR duration IS NULL);

ALTER TABLE test_version DROP CONSTRAINT IF EXISTS availability_range;
ALTER TABLE test_version ADD CONSTRAINT availability_range CHECK (available_to IS NULL OR available_to > available_from);

-- Attempt Answer constraints
ALTER TABLE attempt_answer DROP CONSTRAINT IF EXISTS points_awarded_non_negative;
ALTER TABLE attempt_answer ADD CONSTRAINT points_awarded_non_negative CHECK (points_awarded >= 0);

-- Media constraints
ALTER TABLE media DROP CONSTRAINT IF EXISTS size_positive;
ALTER TABLE media ADD CONSTRAINT size_positive CHECK (size > 0 OR size IS NULL);

-- Relationship constraints
ALTER TABLE parent_student_link DROP CONSTRAINT IF EXISTS no_self_linking;
ALTER TABLE parent_student_link ADD CONSTRAINT no_self_linking CHECK (parent_id <> student_id);

-- ============================================================================
-- 💡 REFRESH FUNCTION
-- ============================================================================
-- You can call this function from a background job to update analytics
-- SELECT refresh_analytics_views();

CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_subject_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_question_analytics;
END;
$$ LANGUAGE plpgsql;
