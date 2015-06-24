FactoryGirl.define do
  factory :repository do
    sequence(:name) { |n| "#{ Faker::Name.name}#{n}" }

    github_url { Faker::Internet.url }
    enabled false
    association :owner, factory: :user
  end
end
