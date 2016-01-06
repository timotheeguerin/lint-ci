# Service to trigger a new scan
class RevisionScan
  attr_accessor :repo

  def initialize(branch)
    @branch = branch
    @repo = branch.repository
  end

  def scan(sha = nil)
    @branch.transaction do
      return _scan(sha)
    end
  end

  # Scan the repo at the given sha. If sha is nil it will get HEAD
  def _scan(sha)
    revision = retrieve_revision(sha)
    return false if revision.nil?
    scan_revision(revision)
    true
  end

  def retrieve_revision(sha)
    revision = @branch.revisions.find_by_sha(sha)
    if revision.nil?
      revision = @branch.revisions.build(sha: sha)
    elsif revision.scanning?
      return nil
    end
    revision.files.destroy_all
    revision.status = :queued
    revision.save
    revision
  end

  def scan_revision(revision)
    # ScanRepositoryJob.perform_now(revision)
    ScanRepositoryJob.perform_later(revision)
  end
end
