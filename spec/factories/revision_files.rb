FactoryGirl.define do
  factory :revision_file do
    revision
    path { "/#{Faker::Name.name}/file.rb" }
    offense_count 1
  end
end
