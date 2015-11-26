FactoryGirl.define do
  factory :branch do
    sequence(:name) { |n| "#{ Faker::Name.name}#{n}" }
    repository
  end

end
