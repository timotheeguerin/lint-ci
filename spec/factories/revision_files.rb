FactoryGirl.define do
  factory :revision_file do
    revision
    path { "/#{Faker::Name.name}/file.rb" }
    offense_count { Random.rand(50) }
    language :ruby
  end
end
