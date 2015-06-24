FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "#{n}#{ Faker::Internet.email}" }
    sequence(:username) { |n| "#{ Faker::Name.name}#{n}" }
    password 'password'
    password_confirmation 'password'
  end
end
