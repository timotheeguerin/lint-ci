# Service to trigger a new scan
class RevisionScan
  attr_accessor :repo

  def initialize(repo)
    @repo = repo
  end

  def scan(sha = nil)
    @repo.transaction do
      return _scan(sha)
    end
  end

  # Scan the repo at the given sha. If sha is nil it will get HEAD
  def _scan(sha)
    revision = @repo.revisions.find_by_sha(sha)
    if revision.nil?
      revision = @repo.revisions.build
    elsif revision.scanning?
      return false
    end
    revision.status = :queued
    revision.save
    scan_revision(revision)
    true
  end

  def scan_revision(revision)
    ScanRepositoryJob.perform_later(revision)
  end
end
